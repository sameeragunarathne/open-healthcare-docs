---
title: "FHIR MCP Server"
---

# FHIR MCP Server

The [FHIR MCP Server](https://github.com/wso2/fhir-mcp-server) is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for FHIR APIs. It bridges AI and LLM tools and healthcare data: an AI assistant or agent connected to it can search, read, and write FHIR resources on any FHIR server, through tools the model already knows how to call.

It is open source under the Apache 2.0 license, and is listed on the [GitHub MCP Registry](https://github.com/mcp/wso2/fhir-mcp-server).

## Core features

- **MCP-compatible transports.** Serve FHIR over stdio, SSE, or streamable HTTP.
- **SMART on FHIR authorization.** Authenticate securely with FHIR servers and clients using the OAuth 2.0 authorization code flow.
- **Response filtering with FHIRPath.** Filter the resources and Bundles returned by `read` and `search` with FHIRPath expressions, so the model only receives the fields it needs and payloads stay small.
- **Works with any MCP client.** For example VS Code, Claude Desktop, MCP Inspector, or your own agents built in WSO2 Integrator.

To see it in action, watch the demos in the [project README](https://github.com/wso2/fhir-mcp-server#demo): one against the public [HAPI FHIR server](https://hapi.fhir.org/) without authorization, and one against the [Epic sandbox](https://open.epic.com/) with the full OAuth 2.0 authorization code flow.

## Tools

| Tool | What it does | Key arguments |
|---|---|---|
| `get_capabilities` | Returns metadata about a resource type, including its supported search parameters and custom operations. | `type` |
| `search` | Runs a FHIR search on a resource type and returns the matching resources. | `type`, `searchParam`, `response_filter_fhirpaths` |
| `read` | Reads one resource by type and id, optionally with search parameters or a custom operation such as `$everything`. | `type`, `id`, `searchParam`, `operation`, `response_filter_fhirpaths` |
| `create` | Creates a new resource of the given type. | `type`, `payload`, `searchParam`, `operation` |
| `update` | Replaces the content of an existing resource. | `type`, `id`, `payload`, `searchParam`, `operation` |
| `delete` | Deletes a resource instance. | `type`, `id`, `searchParam`, `operation` |
| `get_user` | Returns the signed-in user's FHIR resource (for example their `Patient`) as a short profile with fields such as `id`, `name`, and `birthDate`. | — |

For example, `search` with `type` set to `Patient`, `searchParam` set to `{"family": "Simpson", "birthdate": "1956-05-12"}`, and `response_filter_fhirpaths` set to `["Patient.name", "Patient.birthDate"]` returns only the names and birth dates of the matching patients.

Give each agent only the tools it needs. In WSO2 Integrator, pass `permittedTools` to `ai:McpToolKit`, for example `["search", "read"]` for an agent that must not change records. See [Build a healthcare agent](../../ai-agents/build-a-healthcare-agent.md).

## Prerequisites

- Python 3.8 or later, and [uv](https://github.com/astral-sh/uv) for dependency management. Not needed if you run it with Docker.
- A FHIR server you can reach. For a local one, use the [WSO2 FHIR Server](https://wso2.github.io/fhir-server/docs/).

## Install and run

1. Set the environment variables. `FHIR_SERVER_BASE_URL` is required.

   - **With authorization** (the default): set `FHIR_SERVER_BASE_URL`, `FHIR_SERVER_CLIENT_ID`, `FHIR_SERVER_CLIENT_SECRET`, and `FHIR_SERVER_SCOPES`.
   - **Without authorization**: set `FHIR_SERVER_DISABLE_AUTHORIZATION` to `True`.

   ```bash
   export FHIR_SERVER_BASE_URL=""
   export FHIR_SERVER_CLIENT_ID=""
   export FHIR_SERVER_CLIENT_SECRET=""
   export FHIR_SERVER_SCOPES=""

   export FHIR_MCP_HOST="localhost"
   export FHIR_MCP_PORT="8000"
   ```

   You can also put these in a `.env` file.

2. Install and run the server:

   ```bash
   uvx fhir-mcp-server
   ```

The server listens on `http://localhost:8000` by default.

1. Clone the repository:

   ```bash
   git clone https://github.com/wso2/fhir-mcp-server.git
   cd fhir-mcp-server
   ```

2. Create a virtual environment and install the dependencies:

   ```bash
   uv venv
   source .venv/bin/activate
   uv pip sync requirements.txt
   ```

3. Copy the example environment file and edit it:

   ```bash
   cp .env.example .env
   ```

4. Run the server:

   ```bash
   uv run fhir-mcp-server
   ```

1. Pull the image, or build it from the repository:

   ```bash
   docker pull wso2/fhir-mcp-server:latest
   ```

2. Create a `.env` file with your FHIR server and client settings. See [Environment variables](#environment-variables).

3. Run the container:

   ```bash
   docker run --env-file .env -p 8000:8000 wso2/fhir-mcp-server:latest
   ```

When you run the server locally with Docker or Docker Compose, disable authorization by setting `FHIR_SERVER_DISABLE_AUTHORIZATION=True`.

### Run it with the WSO2 FHIR Server

For a complete local environment, the repository's Docker Compose file starts the FHIR MCP Server together with the [WSO2 FHIR Server](https://wso2.github.io/fhir-server/docs/) and its PostgreSQL database.

```bash
curl -LO https://raw.githubusercontent.com/wso2/fhir-mcp-server/main/docker-compose.yml
echo "DB_PASSWORD=$(openssl rand -hex 12)" > .env
docker compose up -d
```

This starts:

- The FHIR MCP Server at `http://localhost:8000`.
- The WSO2 FHIR Server at `http://localhost:8080/fhir/r4`, which the MCP server uses as its FHIR server.

Stop it with `docker compose stop` to keep the data, or `docker compose down` to remove it.

### Connect to another FHIR server

Set `FHIR_SERVER_BASE_URL` to that server's base URL. For example, with a HAPI FHIR server in Docker:

```bash
docker network create fhir-network
docker run -d --name hapi-fhir-server --network fhir-network -p 127.0.0.1:8080:8080 docker.io/hapiproject/hapi:v8.4.0-2

docker run -d --name fhir-mcp-server-hapi --network fhir-network -p 127.0.0.1:8000:8000 \
  -e FHIR_SERVER_BASE_URL=http://hapi-fhir-server:8080/fhir \
  -e FHIR_MCP_HOST=0.0.0.0 \
  -e FHIR_SERVER_DISABLE_AUTHORIZATION=True \
  wso2/fhir-mcp-server:latest
```

If the FHIR server runs on your host instead of in Docker, use `http://host.docker.internal:<port>/...` instead of `localhost`. On Linux, also add `--add-host=host.docker.internal:host-gateway` to `docker run`, and make sure the FHIR server listens on an address containers can reach, such as `0.0.0.0`.

## Connect an MCP client

### VS Code

Open your MCP configuration with **Ctrl+Shift+P** (or **Cmd+Shift+P**) > **MCP: Open User Configuration**, and add the server. VS Code 1.104 or later is required.

```json
"servers": {
    "fhir": {
        "type": "http",
        "url": "http://localhost:8000/mcp"
    }
}
```

```json
"servers": {
    "fhir": {
        "command": "uv",
        "args": [
            "--directory",
            "/path/to/fhir-mcp-server",
            "run",
            "fhir-mcp-server",
            "--transport",
            "stdio"
        ],
        "env": {
            "FHIR_SERVER_ACCESS_TOKEN": "Your FHIR Access Token"
        }
    }
}
```

```json
"servers": {
    "fhir": {
        "type": "sse",
        "url": "http://localhost:8000/sse"
    }
}
```

### Claude Desktop

1. In Claude Desktop, open **Settings** > **Developer** and click **Edit Config**. This opens `claude_desktop_config.json`:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the server:

```json
{
    "mcpServers": {
        "fhir": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "http://localhost:8000/mcp"]
        }
    }
}
```

```json
{
    "mcpServers": {
        "fhir": {
            "command": "uv",
            "args": [
                "--directory",
                "/path/to/fhir-mcp-server",
                "run",
                "fhir-mcp-server",
                "--transport",
                "stdio"
            ],
            "env": {
                "FHIR_SERVER_ACCESS_TOKEN": "Your FHIR Access Token"
            }
        }
    }
}
```

```json
{
    "mcpServers": {
        "fhir": {
            "command": "npx",
            "args": ["-y", "mcp-remote", "http://localhost:8000/sse"]
        }
    }
}
```

### MCP Inspector

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to try the tools and inspect requests and responses:

```bash
npx -y @modelcontextprotocol/inspector
```

Then connect with one of these settings, while the FHIR MCP Server is running:

| Transport | Settings |
|---|---|
| Streamable HTTP | URL `http://localhost:8000/mcp` |
| STDIO | Command `uv`, arguments `--directory /path/to/fhir-mcp-server run fhir-mcp-server --transport stdio` |
| SSE | URL `http://localhost:8000/sse` |

### WSO2 Integrator agents

Connect a WSO2 Integrator agent with `ai:McpToolKit`:

```ballerina
final ai:McpToolKit fhirTools = check new ("http://localhost:8000/mcp", permittedTools = ["search", "read"]);
```

See [Build a healthcare agent](../../ai-agents/build-a-healthcare-agent.md) for a complete prior authorization agent.

## Configuration

### Command-line options

| Option | Description | Values | Default |
|---|---|---|---|
| `--transport` | The transport the server uses to talk to MCP clients. | `stdio`, `sse`, `streamable-http` | `streamable-http` |
| `--log-level` | Logging level. | `DEBUG`, `INFO`, `WARN`, `ERROR` | `INFO` |
| `--help` | Shows the available options. | | |

```bash
uv run fhir-mcp-server --transport streamable-http --log-level DEBUG
```

### Environment variables

**MCP server**

| Variable | Description |
|---|---|
| `FHIR_MCP_HOST` | The host or IP address to bind to, for example `localhost` for local-only access or `0.0.0.0` for all interfaces. |
| `FHIR_MCP_PORT` | The port to listen on, for example `8000`. |
| `FHIR_MCP_SERVER_URL` | A base URL to use instead of one built from the host and port, for example behind a proxy. |
| `FHIR_MCP_REQUEST_TIMEOUT` | Timeout in seconds for requests to the FHIR server. Default `30`. |

**FHIR server and authorization**

These configure the connection to the FHIR server, using the OAuth 2.0 authorization code flow.

| Variable | Description |
|---|---|
| `FHIR_SERVER_BASE_URL` | The FHIR server's base URL, for example `https://hapi.fhir.org/baseR4`. |
| `FHIR_SERVER_CLIENT_ID` | The OAuth 2.0 client ID used to authorize MCP clients with the FHIR server. |
| `FHIR_SERVER_CLIENT_SECRET` | The client secret for that client ID, used during token exchange. |
| `FHIR_SERVER_SCOPES` | Space-separated OAuth 2.0 scopes to request, for example `user/Patient.read user/Observation.read`. Add `fhirUser openid` so that the `get_user` tool can return the user's FHIR resource. |
| `FHIR_SERVER_DISABLE_AUTHORIZATION` | Set to `True` to turn off authorization, for publicly accessible FHIR servers. |
| `FHIR_SERVER_ACCESS_TOKEN` | An access token to use for all requests, which skips the OAuth 2.0 flow. |

`FHIR_SERVER_ACCESS_TOKEN` is a convenience for local `stdio` use only. Do not use it when the MCP server is exposed over a network or the internet.

## Learn more

- [FHIR MCP Server on GitHub](https://github.com/wso2/fhir-mcp-server), including development and testing instructions.
- [Build a healthcare agent](../../ai-agents/build-a-healthcare-agent.md) with the FHIR MCP Server's tools.
- [Govern agents with WSO2 Agent Manager](../../ai-agents/govern-agents.md) to trace every FHIR tool call an agent makes.
