---
title: "Govern agents with WSO2 Agent Manager"
---

# Govern agents with WSO2 Agent Manager

[WSO2 Agent Manager](https://github.com/wso2/agent-manager) is an open control plane for deploying, managing, and governing AI agents. For healthcare agents, it answers the three questions every compliance and security review asks: **who is this agent, what can it touch, and what did it do?**

| Capability | What it gives you |
|---|---|
| **Agent registry** | One place to register every agent, whether it runs on the platform or elsewhere, with its description, owner, and environments. |
| **Agent ID and credentials** | Each agent gets its own identity, so its actions are attributable and its access can be scoped and revoked. |
| **Tracing** | Every agent run is recorded as a trace: the request, each model call with its inputs, outputs, and token use, and each tool call with its arguments and results. |
| **Evaluation monitors** | Monitors that score agent behaviour over time. |
| **AI gateways** | Gateways for agent, MCP, and LLM traffic, where guardrails and rate limits are applied. |

This guide registers the prior authorization agent from [Build a healthcare agent](./build-a-healthcare-agent.md) as an **externally hosted agent**, sends its traces to Agent Manager, and walks through a trace of a real run.

## Prerequisites

1. WSO2 Agent Manager running. For a local installation on k3d, follow the [Agent Manager quick start](https://wso2.com/agent-platform/docs/latest/get-started/quick-start/). The console is then at `http://console.amp.localhost:8080`.
2. The prior authorization agent from [Build a healthcare agent](./build-a-healthcare-agent.md), with its FHIR stack and sample case.
3. Ballerina 2201.14.x or later. WSO2 Integrator includes it.

## Step 1: Register the agent

1. Sign in to the Agent Manager console.
2. Go to **Agents**, click **Add a New Agent**, and choose **Externally-Hosted Agent** > **Register an agent**.
3. Enter a **Name**, for example `Prior Authorization Agent`. The **Agent handle** fills in automatically.
4. Add a short **Description** of what the agent does, so reviewers can see its purpose in the registry.
5. Click **Register**.

![Registering the prior authorization agent as an externally hosted agent](../assets/img/ai-agents/agent-manager-register.png)

The agent gets an **Agent ID**, and the console opens the **Setup Agent** panel.

## Step 2: Configure tracing

In the **Setup Agent** panel, set **Language** to **Ballerina** and **Version** to **2201.14.x+**. For these versions, Ballerina's built-in OpenTelemetry exporter sends the traces, so no extra module import is needed.

![The Setup Agent panel for a Ballerina 2201.14.x agent. The API key and exporter values are hidden in this screenshot.](../assets/img/ai-agents/agent-manager-setup-ballerina.png)

1. Make sure `Ballerina.toml` has observability included. The sample already does:

   ```toml
   [build-options]
   observabilityIncluded = true
   ```

2. Turn on tracing in `Config.toml`. The sample has these lines commented out; uncomment them:

   ```toml
   [ballerina.observe]
   tracingEnabled = true
   tracingProvider = "otel"

   [ballerina.otel]
   tracesProtocol = "http/protobuf"
   ```

3. Choose a **Token Duration** and copy the generated API key. The console shows it only once.

4. Copy the two environment variables from step 4 of the panel. They set the trace endpoint and send the API key as a header:

   ```bash
   export BAL_CONFIG_VAR_BALLERINA_OTEL_TRACESENDPOINT="<trace endpoint from the console>"
   export BAL_CONFIG_VAR_BALLERINA_OTEL_TRACESEXPORTERHEADERS="x-amp-api-key=<your API key>"
   ```

   :::caution
   The API key identifies your agent to Agent Manager. Keep it out of source control: set it as an environment variable, or keep it in a file that your `.gitignore` excludes. The sample's `.gitignore` already excludes `*.env` files.
   :::

5. Run the agent in the same shell. On startup it logs where it sends traces:

   ```text
   ballerina: started publishing traces to Otel on http://<gateway>/otel/v1/traces [HTTP] (with 1 custom header(s))
   ```

For Ballerina 2201.13.x, the panel shows a different setup that imports `ballerinax/amp` and uses `tracingProvider = "amp"`. Use the instructions that match your Ballerina version: the `ballerinax/amp` module does not work with 2201.14.x.

## Step 3: Run the agent and view its traces

Send the prior authorization request from [Step 5 of Build a healthcare agent](./build-a-healthcare-agent.md#step-5-test-the-agent). Then, in the console, open the agent and go to **Observability** > **Traces**.

![The traces of the prior authorization agent in WSO2 Agent Manager](../assets/img/ai-agents/agent-manager-traces.png)

Each row is one agent run. The list shows the **Conversation** (the `sessionId` the request used), the **Input** and **Output**, the **Duration**, the **Tokens** used, and the number of **Spans**. In this run, the agent answered `task-pa-1001` after 69 spans.

## Step 4: Inspect a trace

Click a trace to open **Trace Details**. The left side is the span tree: the HTTP request, the `invoke_agent` span for the agent run, and under it every model call and every tool call in order.

Select the `invoke_agent` span to see the agent's name, its system prompt, and the input messages:

![The agent span of a prior authorization run, with the system prompt and the full list of model and tool calls](../assets/img/ai-agents/agent-manager-trace-agent.png)

Select a tool span to see exactly what the agent asked for. Here the agent reads the MRI order, `ServiceRequest` `sr-1001`, through the FHIR MCP Server's `read` tool:

![A FHIR read tool call in the trace: the agent reads ServiceRequest sr-1001](../assets/img/ai-agents/agent-manager-trace-tool.png)

From the span tree you can answer the questions a review asks about any run:

- **What did the agent read?** Each `execute_tool read` and `execute_tool search` span shows the FHIR resource type and id or search parameters.
- **What did it do?** The `execute_tool requestClinicianReview` spans show the draft the agent sent for review, and confirm it never submitted anything itself.
- **What did the model see and say?** Each model span shows the messages sent to the model and its reply, with token counts.
- **How long did each step take?** Every span shows its duration, so you can see where a run spends its time.

## Agent identity

Every agent registered in Agent Manager gets its own **Agent ID**, shown on the agent's overview page. Actions are attributed to that identity, not to a shared service account, so you can tell which agent did what.

In the console, go to **Security**:

- **Agent ID** shows the agent's identity and the roles and groups assigned to it. Assign roles and groups to control what the agent may do.
- **Credentials** manages the credentials the agent uses, so you can issue, rotate, and revoke them per agent.

For access to clinical data, combine the agent's identity with [SMART on FHIR](../secure-health-apis/guides/smart-on-fhir-overview.md) in front of the FHIR MCP Server, so each agent only gets the FHIR scopes it needs. In the sample, the agent is also limited to the `search` and `read` tools in code.

## Agent evaluation

Tracing shows what an agent did in one run. Evaluation tells you whether it keeps doing the right thing over time.

In the console, go to **Evaluation** > **Monitors** to set up monitors that score the agent's runs. The **Score** column in the traces list shows the result for each run. For a prior authorization agent, useful checks include whether every run ends with a clinician review task, and whether the drafted request cites the diagnosis, the treatment history, and the pain score.

## Audit trail

Agent traces record what each agent did. Combine them with FHIR `AuditEvent` records from your FHIR APIs, which record every access to the data. See [Auditing](../secure-health-apis/guides/auditing.md).
