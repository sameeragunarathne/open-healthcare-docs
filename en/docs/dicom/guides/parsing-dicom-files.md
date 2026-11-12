---
sidebar_position: 2
title: "Parsing DICOM Files"
description: Learn how to parse DICOM files, read data elements by tag or keyword, and validate and encode DICOM datasets using Ballerina.
---

# Parsing DICOM Files

This guide shows how to use the `ballerinax/health.dicom` and `ballerinax/health.dicom.dicomparser` packages in Ballerina. You will parse a DICOM file, read its data elements, and parse person names and dates. You will also validate and encode the dataset.

## Prerequisites

- [Ballerina](https://ballerina.io/downloads/) 2201.10.0 or later, or [WSO2 Integrator](https://wso2.com/integrator/)
- A DICOM file (`.dcm`). Public sample files are available from sources such as the [pydicom test files](https://github.com/pydicom/pydicom-data) and the [Cancer Imaging Archive](https://www.cancerimagingarchive.net/).

## Step 1: Create the project

```bash
bal new dicom_reader
```

Add the imports to `main.bal`:

```ballerina
import ballerina/io;
import ballerinax/health.dicom;
import ballerinax/health.dicom.dicomparser;
```

## Step 2: Parse a DICOM file

`dicomparser:parseFile` reads a DICOM Part 10 file and returns a `dicom:File`, which holds the preamble and the parsed `dataset`. Pass the transfer syntax of the file. Set `ignorePixelData` to `true` when you need only the metadata. This makes parsing much faster and uses far less memory.

```ballerina
public function main() returns error? {
    dicom:File file = check dicomparser:parseFile("./resources/ct-image.dcm",
            dicom:EXPLICIT_VR_LITTLE_ENDIAN, ignorePixelData = true);
    dicom:Dataset dataset = file.dataset;

    check printSummary(dataset);
}
```

The supported transfer syntaxes are `dicom:IMPLICIT_VR_LITTLE_ENDIAN`, `dicom:EXPLICIT_VR_LITTLE_ENDIAN`, and `dicom:EXPLICIT_VR_BIG_ENDIAN`.

To parse an encoded dataset that you already have in memory, for example a payload received over the network, use `dicomparser:parseDataset(bytes, transferSyntax)`. To check whether a file is a DICOM file before you parse it, use `dicomparser:isValidFile`.

## Step 3: Read data elements

Read values with the typed accessors and the tag constants from the data dictionary. Each accessor returns an error if the element is missing or has a different type.

```ballerina
function printSummary(dicom:Dataset dataset) returns error? {
    string patientId = check dicom:getString(dataset, dicom:TAG_PATIENT_ID);
    string modality = check dicom:getString(dataset, dicom:TAG_MODALITY);
    string studyUid = check dicom:getString(dataset, dicom:TAG_STUDY_INSTANCE_UID);

    // PN and DA values have helpers that parse them into structured records.
    dicom:PersonName name = dicom:parsePersonName(check dicom:getString(dataset, dicom:TAG_PATIENT_NAME));
    dicom:DicomDate studyDate = check dicom:parseDate(check dicom:getString(dataset, dicom:TAG_STUDY_DATE));

    io:println("Patient ID: ", patientId);
    io:println("Patient name: ", name.givenName, " ", name.familyName);
    io:println("Modality: ", modality);
    io:println("Study UID: ", studyUid);
    io:println(string `Study date: ${studyDate.year}-${studyDate.month}-${studyDate.day}`);
}
```

Other accessors include `getInt`, `getFloat`, `getStringArray`, `getIntArray`, `getFloatArray`, and `getSequence` (for `SQ` elements).

You can also look up a data element by its keyword. This is useful when keywords come from configuration:

```ballerina
dicom:DataElement? element = dicom:getDataElementFromKeyword(dataset, "BodyPartExamined");
if element is dicom:DataElement {
    io:println(dicom:tagToStr(element.tag), " ", element?.vr, " = ", element.value);
}
```

To list every element in the dataset in tag order, iterate over the sorted dataset:

```ballerina
foreach dicom:DataElement element in dicom:getSortedDataset(dataset) {
    dicom:TagInfo? info = dicom:getTagInfo(element.tag);
    io:println(dicom:tagToStr(element.tag), " ", info?.name ?: "Private or unknown");
}
```

## Step 4: Validate and encode

Before you forward a dataset to another system, validate it against the DICOM data dictionary and the rules of the target transfer syntax. Then encode it.

```ballerina
function prepareForForwarding(dicom:Dataset dataset) returns byte[]|error {
    dicom:ValidationError? validationError = dicom:validate(dataset, dicom:EXPLICIT_VR_LITTLE_ENDIAN);
    if validationError is dicom:ValidationError {
        return error("Invalid DICOM dataset", validationError);
    }
    return dicom:toBytes(dataset, dicom:EXPLICIT_VR_LITTLE_ENDIAN);
}
```

## What's next

- [Publishing DICOM studies as FHIR ImagingStudy resources](./dicom-to-fhir-imagingstudy.md)
