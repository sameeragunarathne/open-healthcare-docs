---
title: "AI Agents - Overview"
---

# AI Agents - Overview

Healthcare work such as prior authorization, care coordination, and claims follow-up is slow, multi-party, and full of manual lookups. That makes it good work for AI agents. It is also regulated work: an agent that reads a patient record or sends a request to a payer must be known, limited to the data it needs, and accountable for every step it takes.

Most healthcare agent pilots stall before production for exactly that reason. The agent itself is rarely the problem. The problem is that nobody can say **who the agent is, what it may touch, or what it did**.

WSO2 Open Healthcare addresses both halves:

- **Build** agents in WSO2 Integrator that work on clean, standards-based FHIR data through governed tools.
- **Govern** those agents in WSO2 Agent Manager with agent identity, scoped access, guardrails, human approval, and end-to-end tracing.

## The Agentic Healthcare Fabric

The Agentic Healthcare Fabric puts WSO2 AI modules (blue) and WSO2 healthcare modules (orange) into one architecture. Every agent works through the same identity, gateways, and FHIR APIs as every other consumer, so the controls you already apply to apps also apply to agents.

![The Agentic Healthcare Fabric: WSO2 AI modules and healthcare modules between consumers, systems of record, and external APIs](../assets/img/ai-agents/agentic-healthcare-fabric.png)

| Layer | What it gives an agent |
|---|---|
| **Interoperable data** | FHIR APIs and a FHIR repository over EHRs, HL7 v2, C-CDA, DICOM, and claims systems, so every agent reads one consistent model. See [Working with FHIR](../fhir/guides/overview-of-fhir.md). |
| **Governed tools** | The [FHIR MCP Server](../fhir/guides/fhir-mcp-server.md) exposes FHIR data as MCP tools (`search`, `read`, `create`, `update`, `delete`), with SMART on FHIR authorization when the FHIR server needs it. |
| **Agent building** | WSO2 Integrator agents with instructions, memory, and tools, plus durable agents for workflows that run for days. |
| **Agent governance** | WSO2 Agent Manager for agent registration, agent identity and credentials, AI gateways with guardrails, tracing of every model call and tool call, and evaluation monitors. |

## Build and govern a prior authorization agent

The guides in this section use one use case throughout: a **prior authorization** request for a knee MRI. A clinician orders the MRI, the payer needs evidence that conservative treatment failed, and the agent assembles that evidence from the patient's FHIR record.

| Guide | What you build | Sample |
|---|---|---|
| [Build a healthcare agent](./build-a-healthcare-agent.md) | An agent that reads the patient's record through the FHIR MCP Server, drafts the prior authorization request, and sends it to a clinician for review. | [prior-auth-agent.zip](pathname:///assets/attachments/ai-agents/prior-auth-agent.zip) |
| [Build a durable agent](./durable-agents.md) | A durable agent for the full multi-day case: checkpointed FHIR and payer calls, a clinician approval gate, a human task for missing documents, and the payer's decision arriving as an event. | [durable-prior-auth-agent.zip](pathname:///assets/attachments/ai-agents/durable-prior-auth-agent.zip) |
| [Govern agents with WSO2 Agent Manager](./govern-agents.md) | Register the agent in WSO2 Agent Manager, send its traces there, and inspect every model call and FHIR tool call. | Uses the first sample |

## Design principles for healthcare agents

- **Ground agents in FHIR, not in raw systems.** Give agents FHIR tools over the interoperability layer instead of direct database or EHR access. The data is normalized, validated, and already behind your API security.
- **Give each agent the least access it needs.** Allow only the tools an agent needs (for example, `search` and `read` but not `delete`), and scope its FHIR access with SMART on FHIR.
- **Keep a person in the loop for clinical and coverage decisions.** Agents draft; clinicians and coordinators approve. Durable agents make approval gates and human tasks part of the workflow.
- **Trace and audit everything.** Every model call and tool call should be traceable to the agent, the session, and the request that caused it.
