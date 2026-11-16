---
title: "Reading C-CDA Documents"
---

# Reading C-CDA Documents

This guide shows how to read C-CDA documents in Ballerina with the [`ballerinax/health.ccda.r3`](https://central.ballerina.io/ballerinax/health.ccda.r3/latest) package. The package provides Ballerina record types for CDA R2/C-CDA documents, sections, entries, and data types. It also provides a parser that detects the document type and returns a typed record.

You will:

1. Parse a document and identify its type.
2. Read patient demographics from the header.
3. Read coded problems from the Problem section as typed `ProblemObservation` records.

Use this approach when you need only part of a document. For example, you might route documents by type, pull the problem list into a care-gap workflow, or build a mapping that the default transformation does not cover. To convert a whole document to FHIR, see [C-CDA to FHIR transformation](../../data-transformation/guides/ccda-to-fhir.md).

## Prerequisites

- [Ballerina](https://ballerina.io/downloads/) 2201.12.0 or later, or [WSO2 Integrator](https://wso2.com/integrator/)

## Step 1: Create the project

Create a new Ballerina project. In WSO2 Integrator, create an integration and add an **Automation** artifact.

```bash
bal new ccda_reader
```

Add the imports to `main.bal`:

```ballerina
import ballerina/data.xmldata;
import ballerina/io;
import ballerinax/health.ccda.r3 as ccda;
```

## Step 2: Parse the document and identify its type

`ccda:parse` reads the document's `templateId` and returns the matching record type. Supported types include `ContinuityofCareDocumentCCD`, `DischargeSummary`, `ReferralNote`, `ProgressNote`, `HistoryandPhysical`, `TransferSummary`, `CarePlan`, `OperativeNote`, `ProcedureNote`, and `UnstructuredDocument`. Use a type test to handle each kind of document.

```ballerina
function getRecordTargets(ccda:ClincialDocument document) returns ccda:RecordTarget[]|error {
    if document is ccda:ContinuityofCareDocumentCCD {
        return document.recordTarget;
    }
    if document is ccda:DischargeSummary {
        return document.recordTarget;
    }
    if document is ccda:ReferralNote {
        return document.recordTarget;
    }
    if document is ccda:ProgressNote {
        return document.recordTarget;
    }
    return error(string `Unsupported document type: ${document.clinicalDocType ?: "unknown"}`);
}
```

The `clinicalDocType` field of every parsed document holds its type name, for example `DischargeSummary`. This is useful for logging and routing.

## Step 3: Read patient demographics

The patient is in `recordTarget/patientRole/patient`. Because the document is a typed record, you access fields directly and the compiler checks every access. Name parts such as `given` and `family` are `ENXP` values, and their text is in the `xmlText` field.

```ballerina
type PatientSummary record {|
    string? mrn;
    string name;
    string? gender;
    string? birthDate;
|};

function joinParts(ccda:ENXP[]? parts) returns string {
    string[] values = from ccda:ENXP part in parts ?: []
        select part?.xmlText ?: "";
    return string:'join(" ", ...values);
}

function readPatient(ccda:RecordTarget recordTarget) returns PatientSummary {
    ccda:PatientRole patientRole = recordTarget.patientRole;
    ccda:Patient? patient = patientRole?.patient;

    ccda:PN[] names = patient?.name ?: [];
    string name = names.length() > 0
        ? string `${joinParts(names[0]?.given)} ${joinParts(names[0]?.family)}`
        : "";

    return {
        mrn: patientRole.id.length() > 0 ? patientRole.id[0]?.extension : (),
        name,
        gender: patient?.administrativeGenderCode?.code,
        birthDate: patient?.birthTime?.value
    };
}
```

## Step 4: Read coded problems

Body sections and entries are identified by `templateId`. Select the Problem Observation entries from the document, and then convert each one into the typed `ccda:ProblemObservation` record with `xmldata:parseAsType`. This gives you the coded problem in `value` as a `CD` (code, code system, display name) and its status and onset time.

```ballerina
xmlns "urn:hl7-org:v3" as v3;

const PROBLEM_OBSERVATION_TEMPLATE_ID = "2.16.840.1.113883.10.20.22.4.4";

function hasTemplate(xml element, string templateId) returns boolean {
    foreach xml:Element template in (element/<v3:templateId>).elements() {
        if template.getAttributes()["root"] == templateId {
            return true;
        }
    }
    return false;
}

function readProblems(xml document) returns ccda:ProblemObservation[]|error {
    ccda:ProblemObservation[] problems = [];
    foreach xml:Element observation in (document/**/<v3:observation>).elements() {
        if hasTemplate(observation, PROBLEM_OBSERVATION_TEMPLATE_ID) {
            ccda:ProblemObservation problem = check xmldata:parseAsType(observation,
                    {textFieldName: "xmlText"});
            problems.push(problem);
        }
    }
    return problems;
}
```

You can use the same pattern with the other entry types in the package, such as `ccda:AllergyIntoleranceObservation`, `ccda:MedicationActivity`, and `ccda:ResultObservation`. Find each one by its C-CDA `templateId`.

## Step 5: Put it together

```ballerina
public function main() returns error? {
    string content = check io:fileReadString("./resources/discharge-summary.xml");

    ccda:ClincialDocument document = check ccda:parse(content);
    io:println("Document type: ", document.clinicalDocType);

    foreach ccda:RecordTarget recordTarget in check getRecordTargets(document) {
        io:println("Patient: ", readPatient(recordTarget));
    }

    foreach ccda:ProblemObservation problem in check readProblems(check xml:fromString(content)) {
        ccda:CD value = problem.value;
        io:println(string `Problem: ${value?.code ?: ""} ${value?.displayName ?: ""} (${value?.codeSystem ?: ""})`);
    }
}
```

Run the program:

```bash
bal run
```

## Converting to FHIR data types

When you need FHIR output rather than C-CDA records, the [`ballerinax/health.fhir.r4utils.ccdatofhir`](https://central.ballerina.io/ballerinax/health.fhir.r4utils.ccdatofhir/latest) package provides field-level mappers that work on the C-CDA XML elements:

| Function | Maps |
|---|---|
| `mapCcdaNameToFhirName` | `name` (PN) to `HumanName[]` |
| `mapCcdaAddressToFhirAddress` | `addr` (AD) to `Address[]` |
| `mapCcdaTelecomToFhirTelecom` | `telecom` (TEL) to `ContactPoint[]` |
| `mapCcdaIdToFhirIdentifier` | `id` (II) to `Identifier` |
| `mapCcdaCodingToFhirCodeableConcept` | `code` / `value` (CD) to `CodeableConcept` |
| `mapCcdaTimestampToFhirDateTime` | `effectiveTime` (TS) to `dateTime` |
| `mapCcdaIntervalToFhirPeriod` | `effectiveTime` (IVL_TS) to `Period` |
| `mapOidToUri` | Code system OID to FHIR code system URI |

To transform a complete document, use `ccdatofhir:ccdaToFhir`. See [C-CDA to FHIR transformation](../../data-transformation/guides/ccda-to-fhir.md).

## What's next

- [Ingesting C-CDA documents into a FHIR repository](./ingest-ccda-to-fhir.md)
- [C-CDA to FHIR transformation](../../data-transformation/guides/ccda-to-fhir.md)
