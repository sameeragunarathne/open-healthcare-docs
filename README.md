# WSO2 Open Healthcare Documentation

This is the source documentation of WSO2 Open Healthcare. The site is built with [Docusaurus](https://docusaurus.io/), and its source lives in the `en` folder.

## Prerequisites

To run the project locally, install [Node.js](https://nodejs.org/) version 20 or later (version 18 is the minimum) and npm.

You don't need Python. The `requirements.txt` file at the repository root is left over from the previous MkDocs site and is not used by the Docusaurus build.

## Run the project locally (dev mode)

**Clone the repo**

```bash
git clone https://github.com/wso2/open-healthcare-docs.git
```

**Install the dependencies**

```bash
cd open-healthcare-docs/en
npm install
```

Run `npm install` again whenever `package.json` changes.

**Run Docusaurus**

Run the following command from inside `open-healthcare-docs/en`:

```bash
npm run start
```

The site opens at [http://localhost:3000](http://localhost:3000) and reloads as you edit. To use a different port, pass it after `--`:

```bash
npm run start -- --port 3311
```

## Build the site

Build the production site and serve it locally, from inside `open-healthcare-docs/en`:

```bash
npm run serve
```

This runs a full build and then serves it at [http://localhost:3000](http://localhost:3000). The build reports broken links and broken Markdown links as warnings, so run it before you open a pull request.

To only build, without serving, run `npm run build`. The output goes to `en/build`.

## Sample downloads

Sample projects that guides offer for download are zip files in `en/static/assets/attachments`. The repository's `.gitignore` excludes `*.zip`, so add new samples with `git add -f`, for example:

```bash
git add -f en/static/assets/attachments/ai-agents/prior-auth-agent.zip
```

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
