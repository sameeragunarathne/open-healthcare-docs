---
sidebar_position: 6
title: "FHIR utility services"
description: Prebuilt services that evaluate FHIRPath expressions against FHIR resources and validate FHIR resources.
---

# FHIR utility services

Small services for common FHIR tasks that any app or integration can call over HTTP, without bundling a FHIR library.

## FHIRPath service

Evaluates [FHIRPath](https://hl7.org/fhir/fhirpath.html) expressions against FHIR R4 resources, to read values from a resource or change them.

- **Get values.** Extract one or more values with FHIRPath expressions.
- **Set values.** Update, add, or remove values at FHIRPath locations.
- **Batch evaluation.** Evaluate several expressions in one request.
- **Optional validation.** Validate the input and output resources.

| | |
|---|---|
| **Endpoints** | `POST /fhirpath/get`, `POST /fhirpath/set` |
| **Default port** | `9090` |
| **Source** | [`miscellaneous/fhirpath-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/miscellaneous/fhirpath-service) |

```bash
cd miscellaneous/fhirpath-service
bal run
```

Read the first given name of a patient:

```bash
curl -X POST http://localhost:9090/fhirpath/get \
  -H "Content-Type: application/json" \
  -d '{
    "fhirResource": {
      "resourceType": "Patient",
      "id": "1",
      "name": [{ "use": "official", "family": "Chalmers", "given": ["Peter", "James"] }],
      "gender": "male"
    },
    "fhirPath": "Patient.name[0].given[0]"
  }'
```

| Request field | Required | Description |
|---|---|---|
| `fhirResource` | Yes | The FHIR resource to evaluate. |
| `fhirPath` | Yes | One FHIRPath expression, or an array of them. |
| `validateInputFHIRResource` | No | Validate the resource before evaluating. Defaults to `false`. |

The [service README](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/miscellaneous/fhirpath-service) documents the `set` endpoint and the response format.

## Validator service

Validates FHIR R4 resources against the FHIR specification, using the `ballerinax/health.fhir.r4.validator` library, and optionally against a terminology service.

| | |
|---|---|
| **Endpoint** | `POST /validate` |
| **Default port** | `9090` |
| **Source** | [`miscellaneous/validator-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/miscellaneous/validator-service) |

The response is an [OperationOutcome](https://hl7.org/fhir/R4/operationoutcome.html):

- **HTTP 200** when the resource is valid, with a single `information` issue that says "Validation Successful".
- **HTTP 400** when it is not, with one issue for each validation error.

### Configure and run

Set `CORS_ALLOWED_ORIGINS` to the origins that may call the service, for example a web app that validates resources in the browser.

To also validate codes against a terminology service, add this to `Config.toml`:

```toml
[ballerinax.health.fhir.r4.validator.terminologyConfig]
isTerminologyValidationEnabled = true
terminologyServiceApi = "http://localhost:9089/fhir/r4"
tokenUrl = ""
clientId = ""
clientSecret = ""
```

`terminologyServiceApi` can point to the [FHIR Terminology Service](../fhir/terminology/overview.md), which listens on port `9089` by default.

```bash
cd miscellaneous/validator-service
bal run

curl -X POST http://localhost:9090/validate \
  -H "Content-Type: application/json" \
  -d '{"resourceType": "Patient", "id": "example", "gender": "female"}'
```

For validation in your own FHIR services, see [Validation](../fhir/guides/validation.md).
