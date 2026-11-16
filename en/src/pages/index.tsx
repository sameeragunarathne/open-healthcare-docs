import React, { type ReactNode, useEffect, useRef, useState } from 'react';
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

type StepLink = { label: string; to?: string; href?: string };

type Step = {
  id: string;
  n: string;
  title: string;
  summary: string;
  heading: string;
  lead: string;
  points: string[];
  links: StepLink[];
  visual: () => ReactNode;
};

/** The detail shown in the step panel: text and points on the left, media on the right. */
function StepContent({ step }: { step: Step }): ReactNode {
  return (
    <div className={styles.stepContent}>
      <div className={styles.bladeText}>
        <p className={styles.eyebrow}>{step.n} · {step.title}</p>
        <Heading as="h3" className={styles.bladeTitle}>{step.heading}</Heading>
        <p className={styles.bladeLead}>{step.lead}</p>
        <ul className={styles.points}>
          {step.points.map((p) => (
            <li key={p}>
              <span className={styles.pointIcon}><Check /></span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className={styles.bladeLinks}>
          {step.links.map((l) => (
            <Link key={l.label} to={l.to} href={l.href} className={styles.textLink}>
              {l.label} <Arrow />
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.bladeVisual}>{step.visual()}</div>
    </div>
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
/*  How you build it: step cards that load their detail in one panel  */
/* ------------------------------------------------------------------ */
const steps: Step[] = [
  {
    id: 'connect',
    n: '01',
    title: 'Connect',
    summary: 'EMRs, FHIR servers, HL7 feeds, DICOM imaging and claims systems.',
    heading: 'Connect any healthcare system',
    lead: 'Prebuilt connectors reach the systems where care data lives, whether they speak FHIR, HL7, DICOM or a proprietary API.',
    points: [
      'Prebuilt EMR connectors for Epic, Oracle Health (Cerner) and athenahealth, and generate a connector for any other EMR',
      'FHIR server connectors for any FHIR R4 repository or EHR API',
      'HL7 v2 over MLLP/TCP and file servers, and DICOM for imaging systems',
      'Databases, claims platforms and any REST endpoint',
    ],
    links: [
      { label: 'EMR connectivity', to: '/docs/emr-connectivity/guides/emr-systems-overview' },
      { label: 'FHIR connector', to: '/docs/fhir/guides/fhir-repository-connector' },
      { label: 'HL7 connector', to: '/docs/hl7/guides/connect-to-hl7-tcp-servers' },
      { label: 'DICOM', to: '/docs/dicom/guides/overview' },
    ],
    visual: () => (
      <Media
        src="/assets/img/home/emr-connect.gif"
        alt="Running a unified patient access integration that calls Epic and Cerner in WSO2 Integrator"
        caption="One integration that pulls patient data from Epic and Oracle Health (Cerner) and returns FHIR."
      />
    ),
  },
  {
    id: 'standardize',
    n: '02',
    title: 'Standardize',
    summary: 'Parse, validate and map every format to FHIR.',
    heading: 'Speak every healthcare standard',
    lead: 'Parse, validate and transform clinical data so every downstream app and agent works from the same FHIR model.',
    points: [
      'FHIR R4 parsing, serialization and profile validation',
      'HL7 v2 and C-CDA mapped to FHIR with prebuilt mappers, and DICOM parsing for imaging metadata',
      'Persist the standardized data in FHIR Server, the fastest open-source FHIR repository',
      'Terminology service for code systems such as SNOMED CT, LOINC and ICD-10-CM',
    ],
    links: [
      { label: 'FHIR', to: '/docs/fhir/guides/overview-of-fhir' },
      { label: 'HL7 v2', to: '/docs/hl7/guides/overview' },
      { label: 'C-CDA', to: '/docs/ccda/guides/overview' },
      { label: 'DICOM', to: '/docs/dicom/guides/overview' },
      { label: 'Prebuilt mappers', to: '/docs/data-transformation/guides/hl7v2-fhir' },
    ],
    visual: () => (
      <Media
        src="/assets/img/home/data-mapping.gif"
        alt="Mapping a lab result to a FHIR Observation with the visual data mapper"
        caption="Map a lab result to a FHIR Observation in the visual data mapper."
      />
    ),
  },
  {
    id: 'expose',
    n: '03',
    title: 'Expose and secure',
    summary: 'FHIR APIs with SMART on FHIR, consent and audit.',
    heading: 'FHIR APIs, secured for patients and partners',
    lead: 'Put FHIR APIs in front of existing systems and open them safely to apps, payers, partners and patients.',
    points: [
      'FHIR APIs with search, $everything, bulk $export and custom operations',
      'SMART on FHIR app launch and OAuth 2.0 scopes',
      'Consent management, auditing and a developer portal for third-party apps',
    ],
    links: [
      { label: 'Expose FHIR APIs', to: '/docs/fhir/guides/expose-fhir-apis' },
      { label: 'FHIR search', to: '/docs/fhir/search/overview' },
      { label: 'SMART on FHIR', to: '/docs/secure-health-apis/guides/smart-on-fhir-overview' },
    ],
    visual: () => (
      <Media
        src="/assets/img/home/fhir-api.png"
        alt="A FHIR R4 Patient API service with read, search and create resources"
        caption="A FHIR R4 Patient API with read, search and create, ready to put behind SMART on FHIR."
      />
    ),
  },
  {
    id: 'build-agents',
    n: '04',
    title: 'Build AI agents',
    summary: 'Agents and workflows that reason over FHIR data with governed tools.',
    heading: 'Build healthcare agents on interoperable data',
    lead: 'Design agents in WSO2 Integrator with instructions, memory and tools, and make them durable for clinical and payer workflows that run for days.',
    points: [
      'Visual agent designer for prompts, memory and tools, with the code always in sync',
      'FHIR MCP Server and FHIR APIs as ready-made tools for clinical data',
      'Durable agents that checkpoint each step, wait for people and resume on events such as a payer decision',
    ],
    links: [
      { label: 'Build healthcare agents', to: '/docs/ai-agents/build-a-healthcare-agent' },
      { label: 'Durable agents', to: '/docs/ai-agents/durable-agents' },
      { label: 'FHIR MCP Server', to: '/docs/fhir/guides/fhir-mcp-server' },
    ],
    visual: () => (
      <Media
        src="/assets/img/home/durable-agent.png"
        alt="Durable prior authorization agent in WSO2 Integrator with FHIR activities, a documentation request task and a payer decision event"
        caption="A durable prior authorization agent: FHIR activities, a human task for missing documents and a payer decision event."
      />
    ),
  },
  {
    id: 'ai',
    n: '05',
    title: 'Govern AI agents',
    summary: 'Identity, scopes, guardrails, approval and audit on every action.',
    heading: 'Agents that act on clinical data, with trust built in',
    lead: 'Manage every agent centrally, see exactly what it did, and limit what it can touch.',
    points: [
      'Agent management to register, version and control agents across the enterprise',
      'Tracing for every reasoning step, model call and tool call, with latency and token use',
      'Agent identity, SMART on FHIR scopes and AI gateway guardrails on every request',
    ],
    links: [
      { label: 'Agent tracing', to: '/docs/ai-agents/govern-agents#step-3-run-the-agent-and-view-its-traces' },
      { label: 'Agent identity', to: '/docs/ai-agents/govern-agents#agent-identity' },
      { label: 'Agent evaluation', to: '/docs/ai-agents/govern-agents#agent-evaluation' },
    ],
    visual: () => <GovernVisual />,
  },
];

function Overview(): ReactNode {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Old anchors (#connect, #standardize, ...) open the matching step.
  useEffect(() => {
    const fromHash = () => {
      const i = steps.findIndex((st) => `#${st.id}` === window.location.hash);
      if (i >= 0) {
        setActive(i);
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const select = (i: number, focus = false) => {
    setActive(i);
    window.history.replaceState(null, '', `#${steps[i].id}`);
    if (focus) tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = steps.length - 1;
    const next = { ArrowRight: i === last ? 0 : i + 1, ArrowDown: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, ArrowUp: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (next !== undefined) {
      e.preventDefault();
      select(next, true);
    }
  };

  const step = steps[active];
  return (
    <section id="how" ref={sectionRef} className={styles.overview}>
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
        <div className={styles.flow} role="tablist" aria-label="How you build it">
          {steps.map((st, i) => (
            <div key={st.id} className={styles.flowStep}>
              <button
                type="button"
                role="tab"
                id={`step-tab-${st.id}`}
                aria-selected={i === active}
                aria-controls="step-panel"
                tabIndex={i === active ? 0 : -1}
                ref={(el) => { tabRefs.current[i] = el; }}
                className={`${styles.flowLink} ${i === active ? styles.flowActive : ''}`}
                onClick={() => select(i)}
                onKeyDown={(e) => onKeyDown(e, i)}>
                <span className={styles.flowNum}>{st.n}</span>
                <span className={styles.flowTitle}>{st.title}</span>
                <span className={styles.flowText}>{st.summary}</span>
              </button>
            </div>
          ))}
        </div>
        <div
          id="step-panel"
          role="tabpanel"
          aria-labelledby={`step-tab-${step.id}`}
          className={styles.stepPanel}>
          <StepContent key={step.id} step={step} />
          <div className={styles.stepFooter}>
            <span className={styles.stepCount}>Step {active + 1} of {steps.length}</span>
            <button
              type="button"
              className={styles.stepNext}
              onClick={() => select((active + 1) % steps.length, true)}>
              {active === steps.length - 1 ? 'Start again' : 'Next'}:{' '}
              <strong>{steps[(active + 1) % steps.length].title}</strong> <Arrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Solutions by segment                                               */
/* ------------------------------------------------------------------ */
const GH_PREBUILT = 'https://github.com/wso2/open-healthcare-prebuilt-services';
const GH_OPENHIE = 'https://github.com/wso2/reference-implementation-openhie';

type Segment = {
  id: string;
  label: string;
  heading: string;
  lead: string;
  outcomes: string[];
  startFrom: StepLink[];
};

const segments: Segment[] = [
  {
    id: 'payers',
    label: 'Payers',
    heading: 'Meet CMS interoperability rules and run prior authorization with AI',
    lead: 'Share member data the way CMS requires, and turn prior authorization into an AI-assisted workflow where agents do the legwork and people make the decisions.',
    outcomes: [
      'CMS interoperability: Patient Access, Provider Access and Payer-to-Payer APIs for CMS-0057-F',
      'Prior authorization with Da Vinci CRD, DTR and PAS',
      'AI agents that gather clinical evidence, check it against coverage rules and draft determinations for reviewer approval',
      'Durable agent workflows that wait days for documents and decisions, with every step traced and audited',
    ],
    startFrom: [
      { label: 'CMS-0057-F reference implementation', href: 'https://github.com/wso2/reference-implementation-cms0057f' },
      { label: 'Durable prior authorization agent', to: '/docs/ai-agents/durable-agents' },
      { label: 'Govern AI agents', to: '/docs/ai-agents/govern-agents' },
    ],
  },
  {
    id: 'providers',
    label: 'Providers',
    heading: 'Unify clinical data in FHIR and put AI to work for your clinicians',
    lead: 'Connect your EMRs and clinical feeds, bring the data together in FHIR, and give clinicians AI agents that take on the paperwork, with every action governed.',
    outcomes: [
      'One FHIR view of each patient across Epic, Oracle Health (Cerner) and other EMRs',
      'HL7 v2 and C-CDA mapped to FHIR, and FHIR APIs for ONC §170.315(g)(10) certification',
      'AI agents that read the patient\'s FHIR record and prepare prior authorization requests for clinician review',
      'Agents limited by SMART on FHIR scopes and traced in WSO2 Agent Manager',
    ],
    startFrom: [
      { label: 'ONC (g)(10) reference implementation', href: 'https://github.com/wso2/reference-implementation-oncg10' },
      { label: 'EHR connectors', to: '/docs/emr-connectivity/guides/emr-systems-overview' },
      { label: 'Build healthcare agents', to: '/docs/ai-agents/build-a-healthcare-agent' },
    ],
  },
  {
    id: 'healthtech',
    label: 'Health tech',
    heading: 'Ship FHIR-native products and AI features faster',
    lead: 'Start from an open-source FHIR stack, give your AI features governed access to clinical data, and plug into any EMR.',
    outcomes: [
      'An open-source FHIR server and terminology service to build on',
      'FHIR MCP Server to give AI assistants and agents FHIR tools',
      'SMART on FHIR app launch and OAuth 2.0 scopes for your apps',
      'Agents traced and governed in WSO2 Agent Manager',
    ],
    startFrom: [
      { label: 'FHIR Server', href: 'https://wso2.github.io/fhir-server/docs/' },
      { label: 'FHIR MCP Server', to: '/docs/fhir/guides/fhir-mcp-server' },
      { label: 'Build healthcare agents', to: '/docs/ai-agents/build-a-healthcare-agent' },
    ],
  },
  {
    id: 'government',
    label: 'Government',
    heading: 'Build national and regional health information exchanges',
    lead: 'Link hospitals, clinics, labs and registries through one interoperability layer, with a trusted patient identity across all of them.',
    outcomes: [
      'An OpenHIE interoperability layer that routes and transforms FHIR, HL7 v2, C-CDA, DICOM and other healthcare data',
      'A client registry (MPI) for patient matching and deduplication',
      'Shared health records and terminology services on open standards',
      'FHIR Subscriptions brokering for encounter notifications across networks',
    ],
    startFrom: [
      { label: 'OpenHIE reference implementation', href: GH_OPENHIE },
      { label: 'Client registry (MPI)', href: `${GH_OPENHIE}/tree/main/cr` },
      { label: 'FHIR Subscriptions broker', href: 'https://github.com/wso2/reference-implementation-fhirsubscriptions-broker' },
    ],
  },
];

function Segments(): ReactNode {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const select = (i: number, focus = false) => {
    setActive(i);
    if (focus) tabRefs.current[i]?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const last = segments.length - 1;
    const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (next !== undefined) {
      e.preventDefault();
      select(next, true);
    }
  };
  const seg = segments[active];
  return (
    <section id="solutions" className={styles.segments}>
      <div className="container">
        <div className={styles.overviewHead}>
          <p className={styles.eyebrow}>Solutions</p>
          <Heading as="h2" className={styles.sectionTitle}>Built for your organization</Heading>
          <p className={styles.sectionLead}>
            Use the building blocks above, together with reference implementations and prebuilt services for
            payers, providers, health tech companies and governments.
          </p>
        </div>
        <div className={styles.segTabs} role="tablist" aria-label="Solutions by segment">
          {segments.map((sg, i) => (
            <button
              key={sg.id}
              type="button"
              role="tab"
              id={`seg-tab-${sg.id}`}
              aria-selected={i === active}
              aria-controls="seg-panel"
              tabIndex={i === active ? 0 : -1}
              ref={(el) => { tabRefs.current[i] = el; }}
              className={`${styles.segTab} ${i === active ? styles.segTabActive : ''}`}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}>
              {sg.label}
            </button>
          ))}
        </div>
        <div id="seg-panel" role="tabpanel" aria-labelledby={`seg-tab-${seg.id}`} className={styles.segPanel}>
          <div key={seg.id} className={styles.segContent}>
            <div>
              <Heading as="h3" className={styles.segHeading}>{seg.heading}</Heading>
              <p className={styles.bladeLead}>{seg.lead}</p>
              <ul className={styles.points}>
                {seg.outcomes.map((o) => (
                  <li key={o}>
                    <span className={styles.pointIcon}><Check /></span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.segStart}>
              <p className={styles.segStartLabel}>Start from</p>
              {seg.startFrom.map((l) => (
                <Link key={l.label} to={l.to} href={l.href} className={styles.segStartLink}>
                  <span>{l.label}</span>
                  <Arrow />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Open-source building blocks                                        */
/* ------------------------------------------------------------------ */
type Offering = {
  name: string;
  tag: string;
  text: string;
  facts: string[];
  links: StepLink[];
};

const offerings: Offering[] = [
  {
    name: 'FHIR Server',
    tag: 'FHIR repository',
    text: 'A fast, lightweight FHIR R4 server written in Go and backed by PostgreSQL.',
    facts: ['Fastest open-source FHIR server in a third-party benchmark', 'Full REST API, search, validation and IGs', 'Under 25 MB, starts in under a second'],
    links: [
      { label: 'Docs', href: 'https://wso2.github.io/fhir-server/docs/' },
      { label: 'GitHub', href: 'https://github.com/wso2/fhir-server' },
    ],
  },
  {
    name: 'FHIR MCP Server',
    tag: 'AI access',
    text: 'Exposes any FHIR server or API as MCP tools for AI assistants and agents.',
    facts: ['search, read, create, update and delete tools', 'SMART on FHIR authorization', 'Works with Claude Desktop, VS Code and agents'],
    links: [
      { label: 'Docs', to: '/docs/fhir/guides/fhir-mcp-server' },
      { label: 'GitHub', href: 'https://github.com/wso2/fhir-mcp-server' },
    ],
  },
  {
    name: 'FHIR Terminology Service',
    tag: 'Terminology',
    text: 'A FHIR R4 terminology service for CodeSystems, ValueSets and ConceptMaps.',
    facts: ['$expand, $validate-code, $lookup, $subsumes and $translate', 'Loads SNOMED CT, LOINC, ICD-10-CM and FHIR code systems', 'Plugs into the FHIR Server'],
    links: [
      { label: 'Docs', to: '/docs/fhir/terminology/overview' },
      { label: 'GitHub', href: `${GH_PREBUILT}/tree/main/terminology/terminology-service` },
    ],
  },
  {
    name: 'Prebuilt services',
    tag: 'Ready to deploy',
    text: 'Ready-made healthcare services you can deploy as they are or extend.',
    facts: ['HL7 v2 to FHIR and C-CDA to FHIR', 'Epic and Oracle Health (Cerner) FHIR API services', 'SMART configuration, metadata, audit, authorization, FHIRPath and validation'],
    links: [
      { label: 'Docs', to: '/docs/prebuilt-services/overview' },
      { label: 'GitHub', href: GH_PREBUILT },
    ],
  },
];

function OpenSource(): ReactNode {
  return (
    <section id="open-source" className={styles.oss}>
      <div className="container">
        <div className={styles.overviewHead}>
          <p className={styles.eyebrow}>Open source</p>
          <Heading as="h2" className={styles.sectionTitle}>Open-source building blocks, ready to run</Heading>
          <p className={styles.sectionLead}>
            Apache 2.0 licensed components you can run today and own outright: a FHIR Server, a FHIR MCP Server,
            a FHIR Terminology Server and a catalog of prebuilt services.
          </p>
        </div>
        <div className={styles.ossGrid}>
          {offerings.map((o) => (
            <article key={o.name} className={styles.ossCard}>
              <p className={styles.ossTag}>{o.tag}</p>
              <Heading as="h3" className={styles.ossName}>{o.name}</Heading>
              <p className={styles.ossText}>{o.text}</p>
              <ul className={styles.ossFacts}>
                {o.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className={styles.ossLinks}>
                {o.links.map((l) => (
                  <Link key={l.label} to={l.to} href={l.href} className={styles.textLink}>
                    {l.label} <Arrow />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Health information exchange (OpenHIE)                              */
/* ------------------------------------------------------------------ */
function Hie(): ReactNode {
  const pointOfService = ['EMRs and hospital systems', 'Clinics and labs', 'Pharmacies', 'Patient and partner apps'];
  const components: { name: string; detail: string; wso2: boolean }[] = [
    { name: 'Client registry (MPI)', detail: 'Reference implementation', wso2: true },
    { name: 'Shared health record', detail: 'FHIR Server', wso2: true },
    { name: 'Terminology service', detail: 'FHIR Terminology Service', wso2: true },
    { name: 'Audit (IHE ATNA)', detail: 'FHIR AuditEvent service', wso2: true },
    { name: 'Facility and health worker registries', detail: 'Connect your own', wso2: false },
  ];
  return (
    <section id="hie" className={styles.hie}>
      <div className="container">
        <div className={styles.overviewHead}>
          <p className={styles.eyebrow}>Health information exchange</p>
          <Heading as="h2" className={styles.sectionTitle}>Build a health information exchange on open standards</Heading>
          <p className={styles.sectionLead}>
            The OpenHIE reference implementation puts an interoperability layer between the systems that create
            care data and the shared registries and records the whole exchange relies on.
          </p>
        </div>
        <div className={styles.hieDiagram} role="img" aria-label="OpenHIE architecture: point-of-service systems connect through the interoperability layer to a client registry, shared health record, terminology service, audit service and other registries">
          <div className={styles.hieLayer}>
            <p className={styles.hieLayerTitle}>Point of service</p>
            <div className={styles.hieRow}>
              {pointOfService.map((p) => (
                <span key={p} className={styles.hieBox}>{p}</span>
              ))}
            </div>
          </div>
          <div className={styles.hieArrow} aria-hidden="true">FHIR · HL7 v2 · C-CDA · DICOM</div>
          <div className={`${styles.hieLayer} ${styles.hieIol}`}>
            <p className={styles.hieLayerTitle}>Interoperability layer</p>
            <div className={styles.hieRow}>
              <span className={styles.hieBoxDark}>Routing</span>
              <span className={styles.hieBoxDark}>HL7 v2 and C-CDA to FHIR</span>
              <span className={styles.hieBoxDark}>Publish and subscribe</span>
              <span className={styles.hieBoxDark}>Audit events</span>
            </div>
          </div>
          <div className={styles.hieArrow} aria-hidden="true">FHIR · IHE PIXm / PDQm</div>
          <div className={styles.hieLayer}>
            <p className={styles.hieLayerTitle}>Registries and shared services</p>
            <div className={styles.hieRow}>
              {components.map((c) => (
                <span key={c.name} className={`${styles.hieBox} ${c.wso2 ? styles.hieWso2 : styles.hieOwn}`}>
                  <strong>{c.name}</strong>
                  <small>{c.detail}</small>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.hieGrid}>
          <div className={styles.hieCard}>
            <p className={styles.ossTag}>Reference implementation</p>
            <Heading as="h3" className={styles.ossName}>Client registry (MPI)</Heading>
            <p className={styles.ossText}>
              A standards-based master patient index that keeps one trusted identity for each patient across the exchange.
            </p>
            <ul className={styles.ossFacts}>
              <li>IHE PDQm and PIXm: demographics query (ITI-78), identity feed (ITI-104) and match (ITI-119)</li>
              <li>Blocking-based matching and incremental deduplication, with match rejection</li>
              <li>A management UI, FHIR AuditEvent logging (IHE ATNA) and any OIDC identity provider</li>
            </ul>
            <div className={styles.ossLinks}>
              <Link href={`${GH_OPENHIE}/tree/main/cr`} className={styles.textLink}>Client registry <Arrow /></Link>
            </div>
          </div>
          <div className={styles.hieCard}>
            <p className={styles.ossTag}>Reference implementation</p>
            <Heading as="h3" className={styles.ossName}>Interoperability layer</Heading>
            <p className={styles.ossText}>
              The central message router of the exchange. It receives FHIR and HL7 v2 messages, routes them to the right
              services and publishes audit events.
            </p>
            <ul className={styles.ossFacts}>
              <li>HTTP and MLLP/TCP listeners for FHIR and HL7 v2 clients</li>
              <li>HL7 v2 ↔ FHIR transformation with the Ballerina health libraries</li>
              <li>WebSub event hub, audit service and OpenSearch dashboards</li>
            </ul>
            <div className={styles.ossLinks}>
              <Link href={`${GH_OPENHIE}/tree/main/iol`} className={styles.textLink}>Interoperability layer <Arrow /></Link>
              <Link href={GH_OPENHIE} className={styles.textLink}>OpenHIE reference implementation <Arrow /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
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
        <Segments />
        <OpenSource />
        <Hie />

        <Architecture />
        <Facts />
        <FinalCta />
      </main>
    </Layout>
  );
}
