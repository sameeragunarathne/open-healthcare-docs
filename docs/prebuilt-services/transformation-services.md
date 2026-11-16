---
title: "Transformation services"
---

# Transformation services

The transformation services convert legacy healthcare formats into FHIR R4, so the rest of your platform works from one model. Both follow the official HL7 mapping guides and expose a single `POST /transform` endpoint.

## HL7 v2 to FHIR service

Transforms HL7 v2 messages into FHIR resources. The mappings follow the official [HL7 v2 to FHIR implementation guide](https://build.fhir.org/ig/HL7/v2-to-fhir/).

| | |
|---|---|
| **Supported HL7 v2 versions** | 2.3, 2.3.1, 2.4, 2.5, 2.5.1, 2.6, 2.7, 2.7.1, 2.8 |
| **FHIR version** | 4.0.1 |
| **Endpoint** | `POST /transform` |
| **Source** | [`transformation/v2-to-fhirr4-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/transformation/v2-to-fhirr4-service) |

### Run it

```bash
cd transformation/v2-to-fhirr4-service
bal run
```

Send an HL7 v2 message:

```bash
curl 'http://localhost:9090/transform' \
  --data-raw 'MSH|^~\&|EPIC|EPICADT|SMS|SMSADT|202211031408|CHARRIS|ADT^A01|1817457|D|2.8'
```

The response is a FHIR Bundle with the resources mapped from the message.

### Customize the mappings

To change how particular segments are mapped, write a service with your own mappings and point the HL7 v2 to FHIR service at it. The service then calls your service for those segments and uses the built-in mappings for the rest.

1. Create a custom mapping service from the template:

   ```bash
   bal new <service_name> -t ballerinax/health.fhir.templates.r4.v2tofhircustomsvc
   ```

2. Configure the HL7 v2 to FHIR service in `Config.toml` to call it for the segments you customized:

   ```toml
   [customMapper]
   baseUrl = "http://localhost:9091/v2tofhir"

   [customMapper.segmentMappings]
   NK1 = "/segment/nk1"
   PID = "/segment/pid"
   ```

| Setting | Description |
|---|---|
| `customMapper.baseUrl` | The base URL of your custom mapping service. |
| `customMapper.segmentMappings.<segment>` | The path on your service that maps that segment. |

For a guide to the mappings themselves, see [HL7 v2 to FHIR](../data-transformation/guides/hl7v2-fhir.md).

## C-CDA to FHIR service

Transforms C-CDA documents into FHIR resources. The mappings follow the official [C-CDA on FHIR implementation guide](http://hl7.org/fhir/us/ccda/2023May/).

| | |
|---|---|
| **FHIR version** | 4.0.1 |
| **Endpoint** | `POST /transform` |
| **Source** | [`transformation/ccda-to-fhirr4-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/transformation/ccda-to-fhirr4-service) |

It maps these C-CDA sections and headers:

| C-CDA | FHIR |
|---|---|
| Allergy Intolerance Observation | `AllergyIntolerance` |
| Problem Observation | `Condition` |
| Results | `DiagnosticReport` |
| Immunization Activity | `Immunization` |
| Medication Activity | `Medication` |
| Patient Role (header) | `Patient` |
| Author (header) | `Practitioner` |
| Procedure Activity | `Procedure` |

### Run it

```bash
cd transformation/ccda-to-fhirr4-service
bal run
```

Send a C-CDA document:

```bash
curl 'http://localhost:9090/transform' \
  --header 'Content-Type: application/xml' \
  --data-raw '...'
```

For more on C-CDA, see [Working with C-CDA](../ccda/guides/overview.md) and [C-CDA to FHIR](../data-transformation/guides/ccda-to-fhir.md).
