---
title: "Build a healthcare agent"
---

# Build a healthcare agent

This guide builds a **prior authorization agent** with [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator). The agent reads a patient's record from a [WSO2 FHIR Server](https://github.com/wso2/fhir-server) through the [FHIR MCP Server](../fhir/guides/fhir-mcp-server.md), drafts a prior authorization request with the supporting evidence, and sends the draft to a clinician for review. It never submits a request on its own.

## Use case

A clinician orders an MRI of the right knee for a patient with knee osteoarthritis. The payer requires prior authorization, with evidence that conservative treatment failed. Today a coordinator collects that evidence by hand from the chart.

The agent does the collection:

1. Reads the MRI order (`ServiceRequest`) and the diagnosis it references (`Condition`).
2. Reads the patient's `Coverage`, prior treatments (`Procedure`, `MedicationStatement`), and the latest pain score (`Observation`).
3. Drafts a short prior authorization request that lists the evidence.
4. Sends the draft to a clinician with the `requestClinicianReview` tool, and replies with the review task id.

The agent only gets two FHIR tools, `search` and `read`. It cannot create, change, or delete records.

![The prior authorization agent in the WSO2 Integrator design view, with the FHIR tools and the clinician review tool](../assets/img/ai-agents/prior-auth-agent-design.png)

## Prerequisites

1. [WSO2 Integrator](https://wso2.com/products/downloads/?product=wso2integrator) installed. It includes the Ballerina distribution.
2. [Docker](https://docs.docker.com/get-docker/) with Docker Compose (or an alternative such as Rancher Desktop or Colima), to run the WSO2 FHIR Server and the FHIR MCP Server.
3. A model the agent can call. The sample uses a local [Ollama](https://ollama.com/) model, `qwen3:4b`, so no API key is needed. To use a hosted model instead, see [Use a different model](#use-a-different-model).
4. `curl` or any HTTP client for testing.

## Get the sample

Download the source project: [prior-auth-agent.zip](pathname:///assets/attachments/ai-agents/prior-auth-agent.zip). It contains:

| File | Purpose |
|---|---|
| `agents.bal` | The agent: model, FHIR MCP tools, the clinician review tool, and the instructions. |
| `main.bal` | An HTTP service that runs the agent for each request. |
| `types.bal`, `functions.bal` | The request type and the review task stub. |
| `Config.toml` | The FHIR MCP Server URL and model settings, plus commented-out tracing settings. |
| `resources/pa-case.json` | A FHIR transaction Bundle with the synthetic prior authorization case. |

## Step 1: Start the WSO2 FHIR Server and the FHIR MCP Server

The FHIR MCP Server repository ships a Docker Compose file that runs the WSO2 FHIR Server, its PostgreSQL database, and the FHIR MCP Server together.

```bash
mkdir fhir-stack && cd fhir-stack
curl -LO https://raw.githubusercontent.com/wso2/fhir-mcp-server/main/docker-compose.yml
echo "DB_PASSWORD=$(openssl rand -hex 12)" > .env
docker compose pull
docker compose up -d
```

This starts:

- The WSO2 FHIR Server at `http://localhost:8080/fhir/r4`.
- The FHIR MCP Server at `http://localhost:8000/mcp`, connected to that FHIR Server.

Check that the FHIR Server is ready:

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/fhir/r4/metadata
# Expect: 200
```

## Step 2: Load the sample case

Load the synthetic case from the sample into the FHIR Server. It creates a patient, Maria Rivera, with:

- A knee osteoarthritis diagnosis (`Condition`, ICD-10-CM `M17.11`).
- Eight sessions of physical therapy with no improvement (`Procedure`).
- Four months of naproxen with inadequate relief (`MedicationStatement`).
- A pain score of 7/10 (`Observation`, LOINC `72514-3`).
- Gold PPO coverage (`Coverage`).
- The MRI order (`ServiceRequest` `sr-1001`, CPT `73721`).

```bash
curl -s -X POST http://localhost:8080/fhir/r4 \
  -H 'Content-Type: application/fhir+json' \
  --data @prior_auth_agent/resources/pa-case.json
```

Each entry in the response should have the status `201 Created`.

## Step 3: Review the agent

Open the `prior_auth_agent` folder in WSO2 Integrator. The design view shows the agent, its model, and its tools. The code is in `agents.bal`.

### FHIR tools from the FHIR MCP Server

`ai:McpToolKit` connects to the FHIR MCP Server and turns its tools into agent tools. `permittedTools` limits the agent to `search` and `read`:

```ballerina
// Tools from the FHIR MCP server, backed by the WSO2 FHIR Server
final ai:McpToolKit fhirTools = check new (fhirMcpUrl, permittedTools = ["search", "read"]);
```

### A human in the loop

The agent cannot submit anything to the payer. Its only action is to hand the draft to a clinician. In the sample, `createReviewTask` returns a task id; in a real deployment it creates a task in your worklist or EHR inbox.

```ballerina
# Send a drafted prior authorization request to a clinician for review.
#
# + patientId - FHIR id of the patient
# + draft - The drafted request with its supporting clinical evidence
# + return - The id of the review task
@ai:AgentTool
isolated function requestClinicianReview(string patientId, string draft) returns string|error {
    return createReviewTask(patientId, draft);
}
```

### The agent

The instructions tell the agent which FHIR resources to read and that it must never submit a request itself:

```ballerina
final ai:Agent priorAuthAgent = check new (
    systemPrompt = {
        role: "Prior Authorization Assistant",
        instructions: string `Gather the clinical evidence for the requested service from the
            patient's FHIR record using the FHIR tools: the ServiceRequest, the Condition it
            references, the Coverage, and prior treatments (Procedure, MedicationStatement)
            and Observations. Then draft a short prior authorization request that lists the
            evidence. Never submit a request yourself. Always send the draft for clinician
            review with requestClinicianReview, then reply with the review task id. /no_think`
    },
    model = model,
    tools = [fhirTools, requestClinicianReview],
    maxIter = 10
);
```

`/no_think` at the end of the instructions turns off the reasoning mode of Qwen 3 models, which makes each step much faster on a local machine. Remove it if you use a different model.

### The service

`main.bal` exposes the agent at `POST /prior-auth/assist`. The `sessionId` keeps the conversation memory for a case together:

```ballerina
service /prior\-auth on new http:Listener(8085, timeout = 900) {
    resource function post assist(PriorAuthQuery query) returns string|error {
        return priorAuthAgent.run(query.message, query.sessionId);
    }
}
```

## Step 4: Run the agent

1. Pull the model, if you haven't already:

   ```bash
   ollama pull qwen3:4b
   ```

2. In WSO2 Integrator, click **Run**. Or run it from a terminal in the `prior_auth_agent` folder:

   ```bash
   bal run
   ```

## Step 5: Test the agent

Ask the agent to prepare the prior authorization for the MRI order:

```bash
curl -s -X POST http://localhost:8085/prior-auth/assist \
  -H 'Content-Type: application/json' \
  -d '{"message":"Prepare the prior authorization for the MRI ordered in ServiceRequest sr-1001 for patient pa-1001.","sessionId":"pa-demo-1"}'
```

The agent reads the order, the diagnosis, the coverage, and the treatment history through the FHIR tools, drafts the request, and sends it for review. It replies with the review task id:

```text
task-pa-1001
```

On a laptop with a small local model, one run can take several minutes because the agent makes about ten model calls. A hosted model is much faster. Model output is AI-generated and can differ between runs, so review the drafted request before you rely on it.

## Use a different model

The agent works with any model provider that supports tool calling. Replace the Ollama provider in `agents.bal`:

- **WSO2 Integrator's default model.** If you are signed in to WSO2 Integrator Copilot, use `check ai:getDefaultModelProvider()` and remove the `ballerinax/ai.ollama` import and the `ollama*` configurables.
- **A hosted provider.** Use the provider module for your model, for example `ballerinax/ai.openai`, `ballerinax/ai.anthropic`, or `ballerinax/ai.azure`, and pass the API key from a `configurable` value in `Config.toml` or an environment variable. Never put the key in source code.

## What's next

- [Build a durable agent](./durable-agents.md) to handle the whole multi-day case, including the clinician approval and the payer's decision.
- [Govern agents with WSO2 Agent Manager](./govern-agents.md) to register this agent and trace every model call and FHIR tool call it makes.
