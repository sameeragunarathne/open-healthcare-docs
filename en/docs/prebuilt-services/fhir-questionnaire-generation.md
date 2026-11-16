---
sidebar_position: 7
title: "FHIR Questionnaire generation"
description: An AI pipeline that turns payer coverage policy PDFs into CMS-0057-F compliant, DTR-ready FHIR Questionnaires enriched with CQL.
---

# FHIR Questionnaire generation

Under the CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F), payers expose their documentation requirements through Da Vinci **Documentation Templates and Rules (DTR)**: FHIR Questionnaires, with CQL that pre-fills the answers from the patient's EHR record. Writing those Questionnaires by hand from long coverage policy documents is slow.

The FHIR Questionnaire generation pipeline automates it. You upload a coverage policy PDF, and AI agents produce a FHIR R4 Questionnaire, review it, enrich it with CQL and ValueSets, and package it as a DTR-ready Bundle.

**Source:** [`ai-agents/fhir-questionnaire-generation`](https://github.com/wso2/open-healthcare-prebuilt-services/tree/main/ai-agents/fhir-questionnaire-generation)

## How it works

1. **Ingest.** You upload a policy PDF to the Policy Preprocessor.
2. **Convert.** The PDF is converted to Markdown.
3. **Chunk.** An LLM extracts the table of contents, and the document is split into sections such as the coverage rationale and the applicable codes.
4. **Generate and review.** A Generator agent writes a FHIR Questionnaire. It is validated against the FHIR R4 schema, and a Reviewer agent returns structured feedback, graded critical, error, or warning. The Generator revises it until the Reviewer approves it, or until the iteration limit is reached.
5. **Enrich.** Each item is mapped to a FHIR resource type and given an EHR-executable CQL expression, and ValueSets are created across SNOMED CT, ICD-10-CM, LOINC, RxNorm, and CPT. The result is a `$questionnaire-package` Bundle.
6. **Store and post.** The Bundle is stored, and optionally posted to a FHIR server.

The two-agent loop is the same pattern as the human approval in [durable agents](../ai-agents/durable-agents.md): one agent drafts, and a second checks the draft before anything is used.

## Components

The pipeline runs as four services in one Docker container, and two AI agents that you run separately.

| Component | Port | Role |
|---|---|---|
| Policy Preprocessor | `6080` | The API you call: file upload, chunking, and orchestration. The only port exposed outside the container. |
| Questionnaire Orchestration | `6060` | The generate-and-review loop. |
| PDF-to-Markdown Service | `8000` | Converts the PDF to Markdown. |
| CQL Enrichment API | `3000` | Generates CQL and assembles the DTR Bundle. |
| Generator agent | `7082` | Writes the FHIR Questionnaire from the policy text. Runs separately. |
| Reviewer agent | `7081` | Validates the Questionnaire and returns feedback. Runs separately. |

## Prerequisites

- Docker and Docker Compose.
- An Anthropic API key with access to Claude, for the agents.
- Ballerina, to run the two agents. For local development of the other services, you also need Python 3.12 and Node.js 20.

## Run the pipeline

1. Start the two agents, each from its own folder:

   ```bash
   # Generator agent (port 7082)
   cd fhir_questionnaire_generation/fhir_questionnaire_agents/fhir_questionnaire_generator_agent
   bal run

   # Reviewer agent (port 7081)
   cd fhir_questionnaire_generation/fhir_questionnaire_agents/fhir_questionnaire_reviewer_agent
   bal run
   ```

2. Copy `.env.example` to `.env` and set at least these values:

   | Variable | Description |
   |---|---|
   | `ANTHROPIC_API_KEY` | Your Anthropic API key. |
   | `FHIR_QUESTIONNAIRE_GENERATOR_URL` | The Generator agent URL, for example `http://<host>:7082/QuestionnaireGenerator`. |
   | `FHIR_REVIEWER_URL` | The Reviewer agent URL, for example `http://<host>:7081/Reviewer`. |
   | `FHIR_SERVER_URL` | Optional. A FHIR server to post the finished Bundles to. Defaults to `http://localhost:9090/fhir/r4`. |
   | `AGENT_CONV_LIMIT` | Optional. The maximum number of generate-and-review rounds. Defaults to `5`. |

   :::caution
   Keep `.env` out of source control. It holds your API key.
   :::

3. Build and start the pipeline:

   ```bash
   docker-compose up --build
   curl http://localhost:6080/health
   ```

## Generate a Questionnaire

```bash
# 1. Upload a coverage policy PDF
curl -X POST http://localhost:6080/convert -F "file=@policy.pdf"

# 2. Poll until the status is COMPLETED
curl "http://localhost:6080/jobStatus?file_name=policy&job_id=<job_id>"

# 3. Get the generated Bundles
curl http://localhost:6080/questionnaires
```

| Method | Path | Description |
|---|---|---|
| `POST` | `/convert` | Upload a policy PDF to start processing. |
| `GET` | `/jobStatus` | Check a job's progress. |
| `GET` | `/questionnaires` | Get the generated FHIR Bundles. |
| `GET` | `/failedScenarios` | List jobs that failed. |
| `POST` | `/reTrigger` | Retry a failed job. |
| `GET` | `/health` | Health check. |

:::note
The Questionnaires are AI-generated. Have a clinical or policy reviewer check each one before you publish it to providers.
:::

## Related

- The [CMS-0057-F reference implementation](https://github.com/wso2/reference-implementation-cms0057f) runs the full prior authorization flow, including DTR.
- [Govern agents with WSO2 Agent Manager](../ai-agents/govern-agents.md) to trace the Generator and Reviewer agents.
