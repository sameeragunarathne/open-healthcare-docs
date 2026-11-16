---
title: "Publishing DICOM Studies as FHIR ImagingStudy Resources"
---

# Publishing DICOM Studies as FHIR ImagingStudy Resources

Clinical apps, analytics platforms, and AI agents increasingly find patient data through FHIR APIs. However, imaging metadata usually stays inside the PACS. In this guide, you build a service that does three things:

1. Accepts a DICOM object over HTTP.
2. Extracts the patient, study, and series metadata.
3. Creates a FHIR R4 [`ImagingStudy`](https://hl7.org/fhir/R4/imagingstudy.html) resource in a FHIR repository, linked to the patient.

```text
Modality / PACS  --DICOM-->  Imaging service  --ImagingStudy-->  FHIR repository  -->  apps, agents
```

## Prerequisites

- [Ballerina](https://ballerina.io/downloads/) 2201.10.0 or later, or [WSO2 Integrator](https://wso2.com/integrator/)
- A FHIR R4 server. For local testing, you can use the [WSO2 Open Healthcare FHIR repository](../../get-started/open-healthcare-quickstart.md).

## Step 1: Create the project

```bash
bal new dicom_to_fhir
```

## Step 2: Configure the FHIR repository client

```ballerina
import ballerina/http;
import ballerinax/health.clients.fhir;
import ballerinax/health.dicom;
import ballerinax/health.dicom.dicomparser;
import ballerinax/health.fhir.r4;
import ballerinax/health.fhir.r4.international401;

configurable string fhirServerUrl = ?;

final fhir:FHIRConnector fhirClient = check new ({
    baseURL: fhirServerUrl,
    mimeType: fhir:FHIR_JSON
});
```

## Step 3: Map DICOM metadata to ImagingStudy

The mapping follows the [DICOM to FHIR ImagingStudy guidance](https://hl7.org/fhir/R4/imagingstudy-mappings.html#dicom):

| DICOM tag | FHIR `ImagingStudy` |
|---|---|
| Study Instance UID `(0020,000D)` | `identifier` (`urn:dicom:uid`) |
| Modality `(0008,0060)` | `modality` (DCM code system) |
| Study Date `(0008,0020)` | `started` |
| Patient ID `(0010,0020)` | `subject` (resolved to a FHIR Patient) |
| Series Instance UID `(0020,000E)` | `series.uid` |

```ballerina
const DICOM_UID_SYSTEM = "urn:dicom:uid";
const DCM_CODE_SYSTEM = "http://dicom.nema.org/resources/ontology/DCM";

function toImagingStudy(dicom:Dataset dataset, string patientReference)
        returns international401:ImagingStudy|error {
    string studyUid = check dicom:getString(dataset, dicom:TAG_STUDY_INSTANCE_UID);
    string seriesUid = check dicom:getString(dataset, dicom:TAG_SERIES_INSTANCE_UID);
    string modality = check dicom:getString(dataset, dicom:TAG_MODALITY);
    dicom:DicomDate studyDate = check dicom:parseDate(check dicom:getString(dataset, dicom:TAG_STUDY_DATE));

    r4:Coding modalityCoding = {system: DCM_CODE_SYSTEM, code: modality};
    return {
        status: "available",
        subject: {reference: patientReference},
        identifier: [{system: DICOM_UID_SYSTEM, value: string `urn:oid:${studyUid}`}],
        modality: [modalityCoding],
        started: formatDate(studyDate),
        series: [
            {
                uid: seriesUid,
                modality: modalityCoding
            }
        ]
    };
}

function formatDate(dicom:DicomDate date) returns string {
    string month = date.month < 10 ? string `0${date.month}` : date.month.toString();
    string day = date.day < 10 ? string `0${date.day}` : date.day.toString();
    return string `${date.year}-${month}-${day}`;
}
```

## Step 4: Resolve the patient

The ImagingStudy must reference a FHIR Patient. Look up the patient by the DICOM Patient ID. In production, look up the patient through the Master Patient Index so that identifiers from different sources resolve to the same person.

```ballerina
function resolvePatient(string dicomPatientId) returns string|error {
    fhir:FHIRResponse response = check fhirClient->search("Patient",
            searchParameters = <map<string[]>>{"identifier": [dicomPatientId]});
    json bundle = response.'resource.toJson();
    json[] entries = check (check bundle.entry).ensureType();
    if entries.length() == 0 {
        return error(string `No patient found for DICOM Patient ID ${dicomPatientId}`);
    }
    string id = check entries[0].'resource.id;
    return string `Patient/${id}`;
}
```

## Step 5: Implement the service

The service accepts a DICOM Part 10 file as `application/dicom`. It parses the metadata without pixel data and creates the ImagingStudy.

```ballerina
service /imaging on new http:Listener(9090) {

    resource function post studies(http:Request request) returns json|http:BadRequest|error {
        byte[] payload = check request.getBinaryPayload();

        dicom:File|dicom:Dataset|dicom:ParsingError parsed = dicomparser:parse(payload,
                dicom:EXPLICIT_VR_LITTLE_ENDIAN, ignorePixelData = true);
        if parsed is dicom:ParsingError {
            return <http:BadRequest>{body: {message: parsed.message()}};
        }
        dicom:Dataset dataset = parsed is dicom:File ? parsed.dataset : parsed;

        string patientId = check dicom:getString(dataset, dicom:TAG_PATIENT_ID);
        string patientReference = check resolvePatient(patientId);

        international401:ImagingStudy imagingStudy = check toImagingStudy(dataset, patientReference);
        fhir:FHIRResponse response = check fhirClient->create(imagingStudy.toJson(),
                returnPreference = fhir:REPRESENTATION);
        return response.'resource.toJson();
    }
}
```

## Step 6: Configure, run, and try it

Create a `Config.toml` file in the project root:

```toml
fhirServerUrl = "http://localhost:9091/fhir/r4"
```

Run the service:

```bash
bal run
```

Send a DICOM file:

```bash
curl -X POST http://localhost:9090/imaging/studies \
  -H "Content-Type: application/dicom" \
  --data-binary @ct-image.dcm
```

The response is the `ImagingStudy` resource created in the FHIR repository. Apps and agents can now find it with a FHIR search such as `GET /ImagingStudy?patient=<id>`.

## Production considerations

- **One study, many instances**: A study arrives as many DICOM objects. Use `conditional create` or `update` on the Study Instance UID so that you add series and instances to an existing ImagingStudy instead of creating duplicates.
- **Endpoints**: Add an `endpoint` reference to the PACS (for example, a DICOMweb WADO-RS endpoint) so that viewers can retrieve the images.
- **PHI**: DICOM headers contain PHI. Expose the service through the WSO2 API Platform with OAuth 2.0 or mTLS, and enable [auditing](../../secure-health-apis/guides/auditing.md).
- **Validation**: Use `dicom:validate` to reject objects that are missing the tags you depend on before you write to the FHIR repository.

## What's next

- [Parsing DICOM files](./parsing-dicom-files.md)
- [Connecting to FHIR repositories](../../fhir/guides/fhir-repository-connector.md)
