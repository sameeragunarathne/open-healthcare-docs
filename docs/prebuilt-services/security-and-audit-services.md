---
title: "Security and audit services"
---

# Security and audit services

These services add two controls that every FHIR API in production needs: deciding whether a caller may access the data, and keeping a record that they did.

## Authorization service

Applies basic patient and privileged-user authorization policies to FHIR API requests. Your API gateway or FHIR facade calls it for each request, with the caller's identity and the requested resource, and acts on its decision. For example, a patient can read only their own records, while a privileged user such as a clinician can read records of other patients.

| | |
|---|---|
| **Endpoint** | `POST /authorize` |
| **Default port** | `9090` |
| **Source** | [`miscellaneous/authz-fhirr4-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/miscellaneous/authz-fhirr4-service) |

```bash
cd miscellaneous/authz-fhirr4-service
bal run
```

Use it as a starting point and extend the policies to match your organization's rules, for example consent or care-team relationships. For the full security model, including SMART on FHIR scopes and consent management, see [SMART on FHIR](../secure-health-apis/guides/smart-on-fhir-overview.md) and [Consent management](../secure-health-apis/guides/consent-management.md).

## Audit service

Records an audit trail of FHIR API calls as FHIR [AuditEvent](https://hl7.org/fhir/R4/auditevent.html) resources. Your FHIR APIs post an event to it after each call, and it writes the events to an audit log. If a write fails, it keeps the event and retries in the background, so events are not lost.

| | |
|---|---|
| **Endpoint** | `POST /audits` |
| **Default port** | `9093` |
| **Source** | [`miscellaneous/audit-service`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/miscellaneous/audit-service) |

Configure it in `Config.toml`:

| Setting | Description | Default |
|---|---|---|
| `auditLogPath` | The file the audit events are written to. | `/tmp/audit-logs/fhir-audit.log` |
| `fhirServerName` | The FHIR server name recorded in each event. | `wso2fhirserver.com` |
| `agentType` | The type of agent recorded in each event. | `humanuser` |
| `cacheCapacity` | How many failed events to keep for retry. | `1000` |

```bash
cd miscellaneous/audit-service
bal run
```

Ship the audit log to your log platform, for example OpenSearch or a SIEM, for search and retention. For how audit logging works with the FHIR APIs you build, see [Auditing](../secure-health-apis/guides/auditing.md).
