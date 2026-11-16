---
sidebar_position: 3
title: "EHR connectivity services"
description: Prebuilt services that expose Epic and Oracle Health (Cerner) FHIR APIs, with the EHR's authentication handled for you.
---

# EHR connectivity services

The EHR connectivity services put a FHIR R4 API in front of an EHR. Each service handles the EHR's authentication and proxies FHIR requests to it, so your apps and integrations call one consistent API. The services are grouped by FHIR resource category, so you can run only the ones you need.

For the concepts behind EHR integration, see [EMR connectivity](../emr-connectivity/guides/emr-systems-overview.md).

## Epic services

These services connect to an Epic instance, or the [Epic FHIR sandbox](https://fhir.epic.com/), using [Epic's FHIR API](https://fhir.epic.com/Documentation).

| Service | FHIR resources | Source |
|---|---|---|
| **Administration** | `Encounter`, `Location`, `Organization`, `Patient`, `Practitioner`, `PractitionerRole`, `RelatedPerson` | [`epic-fhirr4-administration-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/epic-fhirr4-administration-api-service) |
| **Clinical** | `AllergyIntolerance`, `Condition`, `Procedure`, `ServiceRequest` | [`epic-fhirr4-clinical-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/epic-fhirr4-clinical-api-service) |
| **Diagnostics** | `DiagnosticReport`, `Observation` | [`epic-fhirr4-diagnostics-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/epic-fhirr4-diagnostics-api-service) |
| **Financial** | `Account`, `Claim`, `ClaimResponse`, `Contract`, `Coverage`, `CoverageEligibilityRequest`, `CoverageEligibilityResponse`, `EnrollmentRequest`, `EnrollmentResponse`, `ExplanationOfBenefit`, `PaymentNotice`, `PaymentReconciliation`, `VisionPrescription` | [`epic-fhirr4-financial-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/epic-fhirr4-financial-api-service) |
| **Medications** | `Immunization`, `Medication`, `MedicationRequest`, `MedicationStatement` | [`epic-fhirr4-medications-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/epic-fhirr4-medications-api-service) |
| **Workflow** | `Appointment`, `AppointmentResponse`, `Schedule`, `ServiceRequest`, `Slot` | [`epic-fhirr4-workflow-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/epic-fhirr4-workflow-api-service) |

### Configure and run

Epic uses backend services authentication with a signed JWT. Register an app in the [Epic developer portal](https://fhir.epic.com/), then set these environment variables:

| Variable | Description |
|---|---|
| `EPIC_FHIR_SERVER_URL` | The Epic FHIR server URL. |
| `EPIC_FHIR_SERVER_TOKEN_URL` | The Epic token endpoint. |
| `EPIC_FHIR_APP_CLIENT_ID` | The client ID of your Epic app. |
| `EPIC_FHIR_APP_PRIVATE_KEY_FILE` | The path to the private key file you created for your Epic app. |

Run the service, for example the clinical service:

```bash
cd ehr-connectivity/epic-fhirr4-clinical-api-service
bal run
```

Read a resource through it:

```bash
curl 'http://localhost:9090/fhir/r4/Condition?patient=<patient id>'
```

:::caution
Keep the private key file and client credentials out of source control. Set them as environment variables or secrets in your deployment.
:::

## Oracle Health (Cerner) services

These services connect to Oracle Health (Cerner), or the Cerner FHIR sandbox, using [Oracle Health's FHIR API](https://docs.oracle.com/en/industries/health/millennium-platform-apis/).

| Service | FHIR resources | Source |
|---|---|---|
| **Administration** | `Encounter`, `Location`, `Organization`, `Patient`, `Practitioner`, `PractitionerRole`, `RelatedPerson` | [`cerner-fhirr4-administration-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/cerner-fhirr4-administration-api-service) |
| **Workflow** | `Appointment`, `AppointmentResponse`, `Schedule`, `ServiceRequest`, `Slot` | [`cerner-fhirr4-workflow-api-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ehr-connectivity/cerner-fhirr4-workflow-api-service) |

### Configure and run

Set the Oracle Health connection in the service's `Config.toml`:

```toml
baseServerHost = "http://localhost:9090"
cernerUrl = "https://fhir-ehr-code.cerner.com/r4/<tenant id>"
tokenUrl = "https://authorization.cerner.com/tenants/<tenant id>/protocols/oauth2/profiles/smart-v1/token"
clientId = "<client id>"
clientSecret = "<client secret>"
scopes = ["system/Patient.read", "system/Patient.write"]
```

| Field | Description |
|---|---|
| `baseServerHost` | The base host of this service, used in the URLs it returns. |
| `cernerUrl` | The Oracle Health FHIR server URL. |
| `tokenUrl` | The Oracle Health token endpoint. |
| `clientId` | The client ID of your Oracle Health app. |
| `clientSecret` | The client secret of your Oracle Health app. |
| `scopes` | The scopes the service requests. |

Run the service and read a resource:

```bash
cd ehr-connectivity/cerner-fhirr4-administration-api-service
bal run
curl 'http://localhost:9090/fhir/r4/Patient/<patient id>'
```

## Other EHRs

For an EHR without a prebuilt service, start from one of these services and change the EHR client and authentication, or build a connector in WSO2 Integrator. See [EMR connectivity](../emr-connectivity/guides/emr-systems-overview.md) and [EMR connector](../emr-connectivity/guides/emr-connector.md).
