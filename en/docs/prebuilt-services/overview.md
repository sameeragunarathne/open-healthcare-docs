---
sidebar_position: 1
title: "Prebuilt Services - Overview"
description: A catalog of ready-to-run healthcare services for transformation, EHR connectivity, conformance, terminology, security, audit, FHIR utilities, and AI.
---

# Prebuilt Services - Overview

The [Open Healthcare prebuilt services](https://github.com/wso2/open-healthcare-prebuilt-services) are ready-made healthcare services that you can run as they are, or use as a starting point for your own. Instead of writing an HL7 v2 to FHIR converter, an Epic integration, or a SMART discovery endpoint from scratch, you clone the service, configure it, and run it.

All services are open source under the Apache 2.0 license. Most are written in [Ballerina](https://ballerina.io/), so you can open them in [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator), change them in the low-code view or in code, and deploy them anywhere.

## Catalog

| Category | Service | What it does | Default port |
|---|---|---|---|
| **Transformation** | [HL7 v2 to FHIR](./transformation-services.md#hl7-v2-to-fhir-service) | Transforms HL7 v2 messages (2.3 to 2.8) into FHIR R4 resources. | `9090` |
| | [C-CDA to FHIR](./transformation-services.md#c-cda-to-fhir-service) | Transforms C-CDA documents into FHIR R4 resources. | `9090` |
| **EHR connectivity** | [Epic FHIR R4 services](./ehr-connectivity-services.md#epic-services) | Six services that expose Epic's FHIR APIs: administration, clinical, diagnostics, financial, medications, and workflow. | `9090` and up |
| | [Oracle Health (Cerner) FHIR R4 services](./ehr-connectivity-services.md#oracle-health-cerner-services) | Two services that expose Oracle Health's FHIR APIs: administration and workflow. | `9090` and up |
| **Conformance** | [Metadata](./conformance-services.md#metadata-service) | Serves a FHIR CapabilityStatement at `/fhir/r4/metadata`. | `9090` |
| | [SMART configuration](./conformance-services.md#smart-configuration-service) | Serves the SMART on FHIR discovery document at `/.well-known/smart-configuration`. | `9090` |
| **Terminology** | [FHIR Terminology Service](../fhir/terminology/overview.md) | CodeSystems, ValueSets, and ConceptMaps, with SNOMED CT, LOINC, and ICD-10-CM support. | `9089` |
| **Security and audit** | [Authorization](./security-and-audit-services.md#authorization-service) | Applies basic patient and privileged-user authorization policies to FHIR API requests. | `9090` |
| | [Audit](./security-and-audit-services.md#audit-service) | Records FHIR `AuditEvent` resources for FHIR API calls. | `9093` |
| **FHIR utilities** | [FHIRPath](./fhir-utility-services.md#fhirpath-service) | Gets and sets values in FHIR resources with FHIRPath expressions. | `9090` |
| | [Validator](./fhir-utility-services.md#validator-service) | Validates FHIR resources and returns an `OperationOutcome`, with optional terminology validation. | `9090` |
| **FHIR server** | [Ballerina FHIR R4 server](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/miscellaneous/fhir-server) | A FHIR R4 REST server with CRUD, search, history, `$validate`, `$everything`, `$summary`, and `$export`, on H2 or PostgreSQL. For a production FHIR repository, see the [WSO2 FHIR Server](https://wso2.github.io/fhir-server/docs/). | `9090` |
| **AI agents** | [FHIR Questionnaire generation](./fhir-questionnaire-generation.md) | Turns payer coverage policy PDFs into DTR-ready FHIR Questionnaires with CQL, using AI agents. | `6080` |

:::note
Most services listen on port `9090` by default. To run more than one on the same machine, change the port in the service's `Config.toml` or code.
:::

## Prerequisites

- [Ballerina](https://ballerina.io/downloads/) Swan Lake 2201.8.1 or later, or [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator), which includes it. Check each service's `Ballerina.toml` for the exact distribution it was built with.
- For the EHR connectivity services, an Epic or Oracle Health developer account and a registered FHIR app.
- For the FHIR Questionnaire generation pipeline, Docker and an Anthropic API key.

## Run a service

1. Clone the repository:

   ```bash
   git clone https://github.com/wso2/open-healthcare-prebuilt-services.git
   cd open-healthcare-prebuilt-services
   ```

2. Go to the service's folder, for example:

   ```bash
   cd transformation/v2-to-fhirr4-service
   ```

3. Set the service's configuration, if it has any, in `Config.toml` or environment variables. Each service's page lists them.

4. Run the service:

   ```bash
   bal run
   ```

   Or open the folder in WSO2 Integrator and click **Run**.

## Deploy

Each service is a standard Ballerina package, so you can deploy it like any other integration:

- **Your own environment.** Build an executable JAR with `bal build` and run it on a VM, or build a container image and run it on Docker or Kubernetes.
- **WSO2 cloud.** Deploy the service from your fork of the repository to [Devant](https://wso2.com/devant/) or [Choreo](https://wso2.com/choreo/), and set its configuration in the console. Each service's README on GitHub has step-by-step instructions.

## Customize a service

Because the services are source code, you can change anything: add FHIR resources, change mappings, add authorization, or combine services. Some services also have extension points. For example, the HL7 v2 to FHIR service can call your own service for custom segment mappings. See [Customize the mappings](./transformation-services.md#customize-the-mappings).
