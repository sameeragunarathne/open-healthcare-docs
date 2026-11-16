---
title: "Working with C-CDA - Overview"
---

# Working with C-CDA - Overview

Consolidated Clinical Document Architecture (C-CDA) is an HL7 standard, built on HL7 v3 Clinical Document Architecture (CDA), for exchanging clinical documents. In the US, C-CDA documents are required for transitions of care, patient download, and health information exchange. As a result, they remain one of the most common ways that clinical data moves between EHRs, HIEs, and payers.

A C-CDA document is an XML document with two parts:

- **Header**: Identifies the document, its type, the patient (`recordTarget`), the author, the custodian organization, and the encounter.
- **Body**: A set of **sections** such as problems, medications, allergies, results, and procedures. Each section contains a human-readable narrative and machine-readable **entries** coded with standard terminologies such as SNOMED CT, LOINC, and RxNorm.

Documents, sections, and entries are identified by `templateId` OIDs. The following are commonly used:

| Template | `templateId` root |
|---|---|
| US Realm Header | `2.16.840.1.113883.10.20.22.1.1` |
| Continuity of Care Document (CCD) | `2.16.840.1.113883.10.20.22.1.2` |
| Discharge Summary | `2.16.840.1.113883.10.20.22.1.8` |
| Referral Note | `2.16.840.1.113883.10.20.22.1.14` |
| Problem section (entries required) | `2.16.840.1.113883.10.20.22.2.5.1` |
| Medications section (entries required) | `2.16.840.1.113883.10.20.22.2.1.1` |
| Allergies section (entries required) | `2.16.840.1.113883.10.20.22.2.6.1` |

## How WSO2 Open Healthcare supports C-CDA

Ballerina treats XML as a built-in data type, so you can work with C-CDA documents directly. On top of that, WSO2 Open Healthcare provides:

- **Typed C-CDA models**: The [`ballerinax/health.ccda.r3`](https://central.ballerina.io/ballerinax/health.ccda.r3/latest) package provides Ballerina record types for C-CDA documents, sections, entries, and data types. Its `parse` function detects the document type (CCD, Discharge Summary, Referral Note, Progress Note, and more) and returns a typed record.
- **C-CDA to FHIR transformation**: The [`ballerinax/health.fhir.r4utils.ccdatofhir`](https://central.ballerina.io/ballerinax/health.fhir.r4utils.ccdatofhir/latest) package maps a C-CDA document to a FHIR R4 Bundle of US Core resources. These include Patient, Practitioner, Encounter, Condition, AllergyIntolerance, MedicationRequest, Immunization, Procedure, DiagnosticReport, and DocumentReference.
- **Reusable mapping functions**: Field-level mappers for names, addresses, telecoms, identifiers, codes, timestamps, and intervals, so you can build custom mappings without starting from scratch.
- **Customizable mappings**: Override the mapping of any entry type by passing your own mapper functions to the transformation.
- **A pre-built transformation service**: The [C-CDA to FHIR service](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/transformation/ccda-to-fhirr4-service) that you can deploy as is.

Follow the guides below to learn how to work with C-CDA documents in WSO2 Open Healthcare:

- [Reading C-CDA documents](./reading-ccda-documents.md)
- [Ingesting C-CDA documents into a FHIR repository](./ingest-ccda-to-fhir.md)
- [C-CDA to FHIR transformation](../../data-transformation/guides/ccda-to-fhir.md)
