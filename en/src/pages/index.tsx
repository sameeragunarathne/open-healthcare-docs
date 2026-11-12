import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const DOCS_HOME = '/docs/get-started/introduction';
const QUICKSTART = '/docs/get-started/open-healthcare-quickstart';

/* ------------------------------------------------------------------ */
/*  Small shared pieces                                                */
/* ------------------------------------------------------------------ */
function Arrow(): ReactNode {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function Check(): ReactNode {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

type BladeLink = { label: string; to?: string; href?: string };

type BladeProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
  links: BladeLink[];
  visual: ReactNode;
  reverse?: boolean;
  tint?: boolean;
};

function Blade({ id, eyebrow, title, lead, points, links, visual, reverse, tint }: BladeProps): ReactNode {
  return (
    <section id={id} className={`${styles.blade} ${tint ? styles.bladeTint : ''}`}>
      <div className={`container ${styles.bladeInner} ${reverse ? styles.bladeReverse : ''}`}>
        <div className={styles.bladeText}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <Heading as="h2" className={styles.bladeTitle}>{title}</Heading>
          <p className={styles.bladeLead}>{lead}</p>
          <ul className={styles.points}>
            {points.map((p) => (
              <li key={p}>
                <span className={styles.pointIcon}><Check /></span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className={styles.bladeLinks}>
            {links.map((l) => (
              <Link key={l.label} to={l.to} href={l.href} className={styles.textLink}>
                {l.label} <Arrow />
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.bladeVisual}>{visual}</div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
const highlights = [
  'Trusted AI governance',
  'Connectivity to any health system',
  'Built-in FHIR support',
  'SMART on FHIR and consent',
  'Clinical and payer workflows',
  'FHIR, HL7, C-CDA and DICOM',
];

function Hero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className="container">
        <p className={styles.heroEyebrow}>WSO2 Open Healthcare</p>
        <Heading as="h1" className={styles.heroTitle}>
          Trusted AI for healthcare,
          <br />
          <span className={styles.heroAccent}>built on real interoperability.</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          Give every healthcare agent an identity, scoped access and an audit trail,
          with interoperability built in.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.btnPrimary} to={DOCS_HOME}>
            Documentation <Arrow />
          </Link>
          <a className={styles.btnGhost} href="#fabric">
            See the architecture
          </a>
        </div>
        <ul className={styles.highlights} aria-label="Highlights">
          {highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Agentic Healthcare Fabric                                          */
/* ------------------------------------------------------------------ */
function Fabric(): ReactNode {
  const img = useBaseUrl('/assets/img/architecture/agentic-healthcare-fabric.png');
  return (
    <section id="fabric" className={styles.fabric}>
      <div className="container">
        <div className={styles.overviewHead}>
          <p className={styles.eyebrow}>The Agentic Healthcare Fabric</p>
          <Heading as="h2" className={styles.sectionTitle}>Where AI governance meets healthcare interoperability</Heading>
        </div>
        <div className={styles.equation} aria-label="AI modules plus healthcare modules gives agents you can run in production">
          <div className={`${styles.eqTerm} ${styles.eqAi}`}>
            <span className={styles.eqLabel}>AI modules</span>
            <span className={styles.eqText}>Build and govern every agent</span>
          </div>
          <span className={styles.eqOp} aria-hidden="true">+</span>
          <div className={`${styles.eqTerm} ${styles.eqHc}`}>
            <span className={styles.eqLabel}>Healthcare modules</span>
            <span className={styles.eqText}>Interoperable data layer</span>
          </div>
          <span className={styles.eqOp} aria-hidden="true">=</span>
          <div className={`${styles.eqTerm} ${styles.eqResult}`}>
            <span className={styles.eqLabel}>Result</span>
            <span className={styles.eqText}>Agents you can run in production</span>
          </div>
        </div>
        <figure className={styles.archFigure}>
          <a href={img} target="_blank" rel="noopener noreferrer" title="Open the full-size diagram">
            <img src={img} alt="WSO2 Agentic Healthcare Fabric: AI modules and healthcare modules between consumers, systems of record and external APIs" loading="lazy" />
          </a>
        </figure>
        <div className={styles.center}>
          <Link
            href="https://wso2.com/library/whitepapers/agentic-healthcare-enterprise-why-interoperability-was-just-beginning/"
            className={styles.textLink}>
            Read the whitepaper <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Overview: the four capabilities as one flow                        */
/* ------------------------------------------------------------------ */
const flow = [
  { n: '01', title: 'Connect', text: 'EMRs, FHIR servers, HL7 feeds, DICOM imaging and claims systems.', anchor: '#connect' },
  { n: '02', title: 'Standardize', text: 'Parse, validate and map every format to FHIR.', anchor: '#standardize' },
  { n: '03', title: 'Expose and secure', text: 'FHIR APIs with SMART on FHIR, consent and audit.', anchor: '#expose' },
  { n: '04', title: 'Build AI agents', text: 'Agents and workflows that reason over FHIR data with governed tools.', anchor: '#build-agents' },
  { n: '05', title: 'Govern AI agents', text: 'Identity, scopes, guardrails, approval and audit on every action.', anchor: '#ai' },
];

function Overview(): ReactNode {
  return (
    <section className={styles.overview}>
      <div className="container">
        <div className={styles.overviewHead}>
          <p className={styles.eyebrow}>How you build it</p>
          <Heading as="h2" className={styles.sectionTitle}>Interoperability first, then agents you can trust</Heading>
          <p className={styles.sectionLead}>
            An agent is only as safe as the data and the access it is given. Build a clean,
            standards-based data layer first, then put agents on top of it that work through
            the same governed APIs and controls as every other consumer.
          </p>
        </div>
        <ol className={styles.flow}>
          {flow.map((f) => (
            <li key={f.n} className={styles.flowStep}>
              <a href={f.anchor} className={styles.flowLink}>
                <span className={styles.flowNum}>{f.n}</span>
                <span className={styles.flowTitle}>{f.title}</span>
                <span className={styles.flowText}>{f.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Blade visuals: real WSO2 Integrator screenshots and recordings     */
/* ------------------------------------------------------------------ */
function Media({ src, alt, caption }: { src: string; alt: string; caption: string }): ReactNode {
  const url = useBaseUrl(src);
  return (
    <figure className={styles.media}>
      <div className={styles.mediaFrame}>
        <a href={url} target="_blank" rel="noopener noreferrer" title="Open full size">
          <img src={url} alt={alt} loading="lazy" />
        </a>
      </div>
      <figcaption className={styles.mediaCaption}>{caption}</figcaption>
    </figure>
  );
}

function GovernVisual(): ReactNode {
  return (
    <div className={styles.stack}>
      <Media
        src="/assets/img/home/agent-tracing.png"
        alt="WSO2 Agent Manager trace of the prior authorization agent, showing each model call and FHIR tool call, with the read of ServiceRequest sr-1001 selected"
        caption="A prior authorization agent traced in WSO2 Agent Manager: every model call and FHIR tool call, step by step."
      />
      <ul className={styles.guardrails}>
        <li>Agent identity</li>
        <li>SMART on FHIR scopes</li>
        <li>Human approval</li>
        <li>Audit trail</li>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Architecture, deployment and closing call to action                */
/* ------------------------------------------------------------------ */
function Architecture(): ReactNode {
  const img = useBaseUrl('/assets/img/architecture/unified-interoperability-architecture.svg');
  return (
    <section className={styles.architecture}>
      <div className="container">
        <div className={styles.overviewHead}>
          <p className={styles.eyebrow}>Interoperability architecture</p>
          <Heading as="h2" className={styles.sectionTitle}>The interoperability layer underneath</Heading>
          <p className={styles.sectionLead}>
            Consumers, a core healthcare platform and your systems of record, connected
            through one secure, standards-based layer.
          </p>
        </div>
        <figure className={styles.archFigure}>
          <img src={img} alt="WSO2 Open Healthcare unified interoperability architecture" loading="lazy" />
        </figure>
        <div className={styles.center}>
          <Link to="/docs/architecture/overview" className={styles.textLink}>
            Explore the architecture <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

const facts = [
  { title: 'Open source', text: 'Built on open-source WSO2 and Ballerina foundations, with no lock-in.' },
  { title: 'Deploy anywhere', text: 'On premises, any cloud, hybrid, VMs or containers.' },
  { title: 'Built for regulated data', text: 'Security, consent and auditing designed in from the start.' },
];

function Facts(): ReactNode {
  return (
    <section className={styles.facts}>
      <div className={`container ${styles.factsGrid}`}>
        {facts.map((f) => (
          <div key={f.title}>
            <Heading as="h3" className={styles.factTitle}>{f.title}</Heading>
            <p className={styles.factText}>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta(): ReactNode {
  return (
    <section className={styles.cta}>
      <div className="container">
        <Heading as="h2" className={styles.ctaTitle}>Start building</Heading>
        <p className={styles.ctaText}>
          Guides, samples and API references for every capability on this page.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.btnPrimary} to={DOCS_HOME}>
            Read the documentation <Arrow />
          </Link>
          <Link className={styles.btnGhost} to={QUICKSTART}>
            Quick start
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */
export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Trusted AI for healthcare" description={siteConfig.tagline}>
      {/* Marks the page so docs-only navbar items can be hidden here (see custom.css). */}
      <Head>
        <html className="homepage" />
      </Head>
      <Hero />
      <main>
        <Fabric />
        <Overview />

        <Blade
          id="connect"
          eyebrow="01 · Connect"
          title="Connect any healthcare system"
          lead="Prebuilt connectors reach the systems where care data lives, whether they speak FHIR, HL7, DICOM or a proprietary API."
          points={[
            'Prebuilt EMR connectors for Epic, Oracle Health (Cerner) and athenahealth, and generate a connector for any other EMR',
            'FHIR server connectors for any FHIR R4 repository or EHR API',
            'HL7 v2 over MLLP/TCP and file servers, and DICOM for imaging systems',
            'Databases, claims platforms and any REST endpoint',
          ]}
          links={[
            { label: 'EMR connectivity', to: '/docs/emr-connectivity/guides/emr-systems-overview' },
            { label: 'FHIR connector', to: '/docs/fhir/guides/fhir-repository-connector' },
            { label: 'HL7 connector', to: '/docs/hl7/guides/connect-to-hl7-tcp-servers' },
            { label: 'DICOM', to: '/docs/dicom/guides/overview' },
          ]}
          visual={
            <Media
              src="/assets/img/home/emr-connect.gif"
              alt="Running a unified patient access integration that calls Epic and Cerner in WSO2 Integrator"
              caption="One integration that pulls patient data from Epic and Oracle Health (Cerner) and returns FHIR."
            />
          }
        />

        <Blade
          id="standardize"
          eyebrow="02 · Standardize"
          title="Speak every healthcare standard"
          lead="Parse, validate and transform clinical data so every downstream app and agent works from the same FHIR model."
          points={[
            'FHIR R4 parsing, serialization and profile validation',
            'HL7 v2, C-CDA and DICOM parsing with prebuilt mappers to FHIR',
            'Persist the standardized data in the WSO2 FHIR Server, the fastest open-source FHIR server',
            'Terminology service for code systems such as SNOMED CT, LOINC and ICD-10-CM',
          ]}
          links={[
            { label: 'FHIR', to: '/docs/fhir/guides/overview-of-fhir' },
            { label: 'HL7 v2', to: '/docs/hl7/guides/overview' },
            { label: 'C-CDA', to: '/docs/ccda/guides/overview' },
            { label: 'DICOM', to: '/docs/dicom/guides/overview' },
            { label: 'Prebuilt mappers', to: '/docs/data-transformation/guides/hl7v2-fhir' },
          ]}
          visual={
            <Media
              src="/assets/img/home/data-mapping.gif"
              alt="Mapping a lab result to a FHIR Observation with the visual data mapper"
              caption="Map a lab result to a FHIR Observation in the visual data mapper."
            />
          }
          reverse
          tint
        />

        <Blade
          id="expose"
          eyebrow="03 · Expose and secure"
          title="FHIR APIs, secured for patients and partners"
          lead="Put FHIR APIs in front of existing systems and open them safely to apps, payers, partners and patients."
          points={[
            'FHIR APIs with search, $everything, bulk $export and custom operations',
            'SMART on FHIR app launch and OAuth 2.0 scopes',
            'Consent management, auditing and a developer portal for third-party apps',
          ]}
          links={[
            { label: 'Expose FHIR APIs', to: '/docs/fhir/guides/expose-fhir-apis' },
            { label: 'FHIR search', to: '/docs/fhir/search/overview' },
            { label: 'SMART on FHIR', to: '/docs/secure-health-apis/guides/smart-on-fhir-overview' },
          ]}
          visual={
            <Media
              src="/assets/img/home/fhir-api.png"
              alt="A FHIR R4 Patient API service with read, search and create resources"
              caption="A FHIR R4 Patient API with read, search and create, ready to put behind SMART on FHIR."
            />
          }
        />

        <Blade
          id="build-agents"
          eyebrow="04 · Build AI agents"
          title="Build healthcare agents on interoperable data"
          lead="Design agents in WSO2 Integrator with instructions, memory and tools, and make them durable for clinical and payer workflows that run for days."
          points={[
            'Visual agent designer for prompts, memory and tools, with the code always in sync',
            'FHIR MCP Server and FHIR APIs as ready-made tools for clinical data',
            'Durable agents that checkpoint each step, wait for people and resume on events such as a payer decision',
          ]}
          links={[
            { label: 'Build a healthcare agent', to: '/docs/ai-agents/build-a-healthcare-agent' },
            { label: 'Durable agents', to: '/docs/ai-agents/durable-agents' },
            { label: 'FHIR MCP Server', href: 'https://github.com/wso2/fhir-mcp-server' },
          ]}
          visual={
            <Media
              src="/assets/img/home/durable-agent.png"
              alt="Durable prior authorization agent in WSO2 Integrator with FHIR activities, a documentation request task and a payer decision event"
              caption="A durable prior authorization agent: FHIR activities, a human task for missing documents and a payer decision event."
            />
          }
          reverse
          tint
        />

        <Blade
          id="ai"
          eyebrow="05 · Govern AI agents"
          title="Agents that act on clinical data, with trust built in"
          lead="Manage every agent centrally, see exactly what it did, and limit what it can touch."
          points={[
            'Agent management to register, version and control agents across the enterprise',
            'Tracing for every reasoning step, model call and tool call, with latency and token use',
            'Agent identity, SMART on FHIR scopes and AI gateway guardrails on every request',
          ]}
          links={[
            { label: 'Agent tracing', to: '/docs/ai-agents/govern-agents#step-3-run-the-agent-and-view-its-traces' },
            { label: 'Agent identity', to: '/docs/ai-agents/govern-agents#agent-identity' },
            { label: 'Agent evaluation', to: '/docs/ai-agents/govern-agents#agent-evaluation' },
          ]}
          visual={<GovernVisual />}
        />

        <Architecture />
        <Facts />
        <FinalCta />
      </main>
    </Layout>
  );
}
