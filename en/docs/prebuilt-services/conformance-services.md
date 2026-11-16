---
sidebar_position: 4
title: "Conformance services"
description: Prebuilt services that publish a FHIR CapabilityStatement and a SMART on FHIR discovery document for your FHIR APIs.
---

# Conformance services

FHIR clients discover what a FHIR server supports, and how to authorize with it, from two well-known endpoints. The conformance services publish both for your FHIR APIs, from configuration, so you don't have to hand-write the documents.

## Metadata service

Implements the FHIR [capabilities interaction](https://www.hl7.org/fhir/http.html#capabilities). It returns a [CapabilityStatement](http://hl7.org/fhir/StructureDefinition/CapabilityStatement) that lists the resource types and interactions your FHIR server supports.

| | |
|---|---|
| **FHIR version** | 4.0.1 |
| **Endpoint** | `GET /fhir/r4/metadata` |
| **Source** | [`conformance/metadata-fhirr4-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/conformance/metadata-fhirr4-service) |

### Configure and run

Describe your server in `Config.toml`. The main settings are:

| Setting | Description | Example |
|---|---|---|
| `version` | Business version of the CapabilityStatement. | `0.1.7` |
| `name` | Computer-friendly name. | `WSO2OpenHealthcareFHIR` |
| `title` | Human-friendly name. | `FHIR Server` |
| `status` | `draft`, `active`, `retired`, or `unknown`. | `active` |
| `kind` | `instance`, `capability`, or `requirements`. | `instance` |
| `fhirVersion` | The FHIR version the server supports. | `4.0.1` |
| `format` | Supported formats. | `["json"]` |
| `interaction` | Supported system-level interactions. | `["search-system", "history-system"]` |

Then add a resource entry for each FHIR resource type your server exposes, with its supported interactions and search parameters. The [service README](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/conformance/metadata-fhirr4-service) lists every setting, including security and resource settings.

```bash
cd conformance/metadata-fhirr4-service
bal run
curl 'http://localhost:9090/fhir/r4/metadata'
```

## SMART configuration service

Implements the [SMART App Launch discovery](https://www.hl7.org/fhir/smart-app-launch/#discovery-of-server-capabilities-and-configuration) endpoint. SMART apps read this document, at `.well-known/smart-configuration` relative to the FHIR base URL, to find your authorization endpoints and the SMART features your server supports.

| | |
|---|---|
| **FHIR version** | 4.0.1 |
| **Endpoint** | `GET /.well-known/smart-configuration` |
| **Source** | [`conformance/smart-config-fhirr4-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/conformance/smart-config-fhirr4-service) |

### Configure and run

Set your authorization server's details in `Config.toml`. The main settings are:

| Setting | Required | Description |
|---|---|---|
| `authorizationEndpoint` | Required | The OAuth 2.0 authorization endpoint. |
| `tokenEndpoint` | Required | The OAuth 2.0 token endpoint. |
| `grantTypesSupported` | Required | `authorization_code` for SMART App Launch, `client_credentials` for backend services. |
| `capabilities` | Required | The SMART capabilities the server supports. |
| `issuer`, `jwksUri` | Conditional | Required when the server supports `sso-openid-connect`. |
| `scopesSupported` | Recommended | The scopes clients may request. |
| `introspectionEndpoint`, `revocationEndpoint`, `managementEndpoint` | Recommended | Token introspection and revocation, and where users manage app access. |

```bash
cd conformance/smart-config-fhirr4-service
bal run
curl 'http://localhost:9090/.well-known/smart-configuration'
```

For more on SMART on FHIR, see [SMART on FHIR](../secure-health-apis/guides/smart-on-fhir-overview.md).
