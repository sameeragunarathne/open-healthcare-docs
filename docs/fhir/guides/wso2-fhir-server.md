---
title: "WSO2 FHIR Server"
---

# WSO2 FHIR Server

Once you have parsed, validated, and mapped your data to FHIR, it needs a home. The [WSO2 FHIR Server](https://github.com/wso2/fhir-server) is an open-source FHIR REST server written in Go and backed by PostgreSQL. It stores FHIR resources, serves the full FHIR REST API over them, and validates what is written.

It is the fastest open-source FHIR server according to a [third-party performance benchmark](https://healthsamurai.github.io/fhir-server-performance-benchmark/).

## Why the WSO2 FHIR Server

- **Fast.** Write-time indexing and per-query plan selection in PostgreSQL, built for FHIR-shaped data.
- **Lightweight.** One binary and one database. The container image is under 25 MB, and it starts in under a second.
- **Open source.** Apache 2.0 licensed. You own your deployment and your data.
- **Cloud-native.** Stateless and deployable with Helm, with health probes, Prometheus metrics, OpenTelemetry tracing, and multi-tenancy built in.
- **Deploy anywhere.** VMs, Docker, Kubernetes, or any cloud.

## Key capabilities

| Capability | What it covers |
|---|---|
| **FHIR REST API** | Create, read, update, and delete with versioning and history, conditional interactions, batch and transaction Bundles, `$everything`, `$validate`, and a generated CapabilityStatement. |
| **Search** | String, token, date, reference, number, quantity, URI, and composite parameters, with modifiers, chaining, `_include` and `_revinclude`, and custom `SearchParameter` registration. |
| **Validation** | Base-specification checks and referential integrity on writes and deletes by default, opt-in profile validation against loaded Implementation Guides, and `$validate` to test resources without storing them. |
| **Implementation Guides** | IG packages loaded at startup. Their profiles and search parameters feed validation and the CapabilityStatement. |
| **Terminology** | Uses any standard FHIR terminology service, such as the [WSO2 FHIR terminology service](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/terminology/terminology-service). See also [Terminology](../terminology/overview.md). |
| **Multi-tenancy** | Physical (a server and database per tenant) or logical (shared) isolation. |
| **Operations** | Liveness and readiness probes, structured JSON logs, observability hooks, and configuration through YAML, environment variables, or both. |

## Architecture

![WSO2 FHIR Server architecture: clients and an API gateway, the server's HTTP, store, search, and validation layers, PostgreSQL persistence, and external package registry and terminology services](../../assets/img/fhir/wso2-fhir-server-architecture.png)

The server does not authenticate users itself. Put it behind an API gateway or authentication proxy that authenticates callers and authorizes their tenant, for example with [SMART on FHIR](../../secure-health-apis/guides/smart-on-fhir-overview.md).

## Where it fits in WSO2 Open Healthcare

- **Store standardized data.** Persist the FHIR resources you produce from HL7 v2, C-CDA, DICOM, or EMR data with the [prebuilt mappers](../../data-transformation/guides/hl7v2-fhir.md).
- **Back your FHIR APIs.** Use it as the repository behind the FHIR facades you build, with the [FHIR connector](./fhir-repository-connector.md). The [quick start guide](../../get-started/open-healthcare-quickstart.md) builds a Patient API facade in front of it.
- **Give AI agents governed access.** The [FHIR MCP Server](https://github.com/wso2/fhir-mcp-server) exposes its data to AI agents as MCP tools. See [Build a healthcare agent](../../ai-agents/build-a-healthcare-agent.md).

## Get started

Start the server and its PostgreSQL database with Docker Compose:

```bash
curl -LO https://raw.githubusercontent.com/wso2/fhir-server/main/docker-compose.yml
docker compose up -d
```

Create your first resource:

```bash
curl -s -X POST http://localhost:9090/fhir/r4/Patient \
  -H "Content-Type: application/fhir+json" \
  -d '{"resourceType":"Patient","name":[{"family":"Smith","given":["Alice"]}]}'
```

To try it without installing anything, use the hosted demo at [fhir-explorer.openhealthcare.wso2.com](https://fhir-explorer.openhealthcare.wso2.com/).

## Learn more

The full WSO2 FHIR Server documentation is at [wso2.github.io/fhir-server/docs](https://wso2.github.io/fhir-server/docs/):

- [Quickstart](https://wso2.github.io/fhir-server/docs/get-started/quickstart/)
- [Architecture](https://wso2.github.io/fhir-server/docs/architecture/)
- [FHIR API](https://wso2.github.io/fhir-server/docs/api/interactions/) and [search](https://wso2.github.io/fhir-server/docs/api/search/)
- [Implementation Guides](https://wso2.github.io/fhir-server/docs/conformance/implementation-guides/)
- [Deployment](https://wso2.github.io/fhir-server/docs/administration/deployment/)
