---
title: "Working with DICOM - Overview"
---

# Working with DICOM - Overview

DICOM (Digital Imaging and Communications in Medicine) is the international standard for medical images and related information. Every CT, MR, X-ray, ultrasound, and other imaging study produced by a modality and stored in a PACS is a set of DICOM objects.

A DICOM object is a **dataset**, which is a list of **data elements**. Each data element has:

- A **tag**: A `(group, element)` pair such as `(0010,0010)` for Patient's Name. Each tag also has a keyword, such as `PatientName`.
- A **value representation (VR)**: The data type, such as `PN` (person name), `DA` (date), `UI` (unique identifier), or `SQ` (sequence).
- A **value**: The data itself. The pixel data of an image is stored in the `(7FE0,0010)` tag.

Images are organized in a **Patient → Study → Series → Instance** hierarchy. Each level is identified by a UID, such as Study Instance UID or Series Instance UID.

## Why DICOM matters for interoperability

Imaging metadata is often locked inside PACS and modality systems while the rest of the clinical record moves to FHIR. When you bring that metadata into your integration layer, you can:

- Publish imaging studies as FHIR [`ImagingStudy`](https://hl7.org/fhir/R4/imagingstudy.html) resources so that apps and AI agents can find them next to Conditions, Observations, and DiagnosticReports.
- Route and pre-fetch studies based on orders and appointments.
- Feed imaging metadata into analytics, quality, and prior authorization workflows.
- Check incoming objects for required tags before they reach downstream systems.

## How WSO2 Open Healthcare supports DICOM

WSO2 Open Healthcare provides native DICOM packages for Ballerina:

- [`ballerinax/health.dicom`](https://central.ballerina.io/ballerinax/health.dicom/latest): DICOM data types (`Dataset`, `DataElement`, `Tag`, `Vr`), the full data dictionary as constants (for example `dicom:TAG_PATIENT_NAME`), typed accessors, value parsers for person names, dates, and times, plus validation and encoding.
- [`ballerinax/health.dicom.dicomparser`](https://central.ballerina.io/ballerinax/health.dicom.dicomparser/latest): Parses DICOM files (Part 10) and encoded datasets. It supports implicit and explicit VR little endian and explicit VR big endian transfer syntaxes. You can skip pixel data when you need only the metadata.
- [`ballerinax/health.dicom.dicomweb`](https://central.ballerina.io/ballerinax/health.dicom.dicomweb/latest) and [`ballerinax/health.dicom.dicomservice`](https://central.ballerina.io/ballerinax/health.dicom.dicomservice/latest): DICOMweb types and a custom service listener for building DICOMweb APIs. The listener validates request headers, processes standard query parameters such as `includefield`, `limit`, and `offset`, and gives each resource function a `DicomContext`.

Follow the guides below to learn how to work with DICOM in WSO2 Open Healthcare:

- [Parsing DICOM files](./parsing-dicom-files.md)
- [Publishing DICOM studies as FHIR ImagingStudy resources](./dicom-to-fhir-imagingstudy.md)
