---
sidebar_position: 3
title: "Ingesting C-CDA Documents into a FHIR Repository"
description: Build a service that receives C-CDA documents, transforms them into FHIR R4 resources, and stores them in a FHIR repository.
---

# Ingesting C-CDA Documents into a FHIR Repository

Many organizations receive clinical data as C-CDA documents from partner EHRs, HIEs, and patient-download flows, but serve it to apps and agents through FHIR APIs. In this guide, you build a service that does three things:

1. Receives a C-CDA document over HTTP.
2. Transforms it into a FHIR R4 Bundle of US Core resources.
3. Stores each resource in a FHIR repository and returns the resulting resource references.

```text
Partner EHR / HIE  --C-CDA (XML)-->  Ingestion service  --FHIR R4-->  FHIR repository
```

## Prerequisites

- [Ballerina](https://ballerina.io/downloads/) 2201.10.0 or later, or [WSO2 Integrator](https://wso2.com/integrator/)
- A FHIR R4 server to store the resources. For local testing, you can use the [WSO2 Open Healthcare FHIR repository](../../get-started/open-healthcare-quickstart.md) or any public test server.

## Step 1: Create the project

```bash
bal new ccda_ingestion
```

## Step 2: Configure the FHIR repository client

Add the FHIR repository URL as a configurable value, and create a FHIR client.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/health.clients.fhir;
import ballerinax/health.fhir.r4;
import ballerinax/health.fhir.r4utils.ccdatofhir;

configurable string fhirServerUrl = ?;

final fhir:FHIRConnector fhirClient = check new ({
    baseURL: fhirServerUrl,
    mimeType: fhir:FHIR_JSON
});
```

If your FHIR repository is secured, add an `authConfig` to the client configuration. For example, use OAuth 2.0 client credentials. See [Connecting to FHIR repositories](../../fhir/guides/fhir-repository-connector.md).

## Step 3: Implement the service

The service has two resources:

- `POST /ccda/transform` returns the FHIR Bundle without storing it. This is useful for previews and testing.
- `POST /ccda/ingest` stores each resource in the FHIR repository.

```ballerina
type IngestResult record {|
    string[] created;
    string[] failed;
|};

service /ccda on new http:Listener(9090) {

    // Transform a C-CDA document into a FHIR Bundle.
    resource function post transform(@http:Payload xml document) returns json|http:BadRequest {
        r4:Bundle|r4:FHIRError bundle = ccdatofhir:ccdaToFhir(document);
        if bundle is r4:FHIRError {
            return <http:BadRequest>{body: {message: bundle.message()}};
        }
        return bundle.toJson();
    }

    // Transform a C-CDA document and store the resources in the FHIR repository.
    resource function post ingest(@http:Payload xml document) returns IngestResult|http:BadRequest {
        r4:Bundle|r4:FHIRError bundle = ccdatofhir:ccdaToFhir(document);
        if bundle is r4:FHIRError {
            return <http:BadRequest>{body: {message: bundle.message()}};
        }

        IngestResult result = {created: [], failed: []};
        foreach r4:BundleEntry entry in bundle.entry ?: [] {
            anydata 'resource = entry?.'resource;
            if 'resource is () {
                continue;
            }
            fhir:FHIRResponse|fhir:FHIRError response = fhirClient->create('resource.toJson(),
                    returnPreference = fhir:REPRESENTATION);
            if response is fhir:FHIRError {
                log:printError("Failed to store resource", response);
                result.failed.push(response.message());
                continue;
            }
            string? location = response.serverResponseHeaders["Location"];
            result.created.push(location ?: "created");
        }
        return result;
    }
}
```

## Step 4: Configure and run

Create a `Config.toml` file in the project root:

```toml
fhirServerUrl = "http://localhost:9091/fhir/r4"
```

Run the service:

```bash
bal run
```

## Step 5: Try it

Send a C-CDA document to the `transform` resource to preview the result:

```bash
curl -X POST http://localhost:9090/ccda/transform \
  -H "Content-Type: application/xml" \
  --data-binary @discharge-summary.xml
```

Then ingest it:

```bash
curl -X POST http://localhost:9090/ccda/ingest \
  -H "Content-Type: application/xml" \
  --data-binary @discharge-summary.xml
```

The response lists the location of each resource created in the FHIR repository.

## Production considerations

- **Patient matching**: Before creating a Patient, look up existing patients through the [Master Patient Index](../../get-started/architecture.md) or a FHIR search on identifiers. This avoids duplicate records. Then update the references in the other resources.
- **Atomic writes**: To store all resources or none, convert the bundle into a FHIR `transaction` bundle and submit it with `fhirClient->'transaction(...)`.
- **Provenance**: Keep the source document by storing it as a `DocumentReference` and linking the created resources to it with `Provenance`.
- **Custom mappings**: If a partner's documents need a different mapping for a section, pass a custom `ccdatofhir:CcdaToFhirMapper` to `ccdaToFhir`.
- **Security and audit**: Expose the service through the WSO2 API Platform. Use OAuth 2.0 or mTLS for partners, and enable auditing. See [Auditing](../../secure-health-apis/guides/auditing.md).

## What's next

- [Reading C-CDA documents](./reading-ccda-documents.md)
- [C-CDA to FHIR transformation](../../data-transformation/guides/ccda-to-fhir.md)
