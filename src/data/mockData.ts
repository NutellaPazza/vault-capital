import { StartupDeal, Pool, User, Position, MarketplaceListing, Transaction, Notification, MarketplaceOffer } from '@/types';

const now = new Date();

// Demo startup deals
export const initialDeals: StartupDeal[] = [
  {
    id: 'deal-1',
    startup_name: 'Axon Finance',
    industry: 'Fintech',
    sector_type: 'B2B',
    country: 'Italy',
    website_url: 'https://axonfinance.example.com',
    stage: 'pre-seed',
    short_description: 'AI-powered SME credit scoring platform for European banks',
    long_description: 'Axon Finance is an AI-powered SME credit scoring platform that replaces traditional bank underwriting for businesses under €5M revenue. Our engine processes 200+ data signals — banking flows, accounting data, public registries, and industry benchmarks — to deliver an underwriting decision in 72 hours instead of three weeks. Currently piloting with 3 regional banks in Lombardy, with a Letter of Intent signed with Banco BPM.',
    highlights: [
      '€180K ARR from 3 pilot banks in Lombardy',
      'Average approval time reduced from 3 weeks to 4 days',
      'Letter of Intent signed with Banco BPM',
      'Founding team combines credit risk and applied ML',
      'Backed by 2 Italian fintech angels',
    ],
    risks: [
      'Regulatory approval required for credit scoring models (Bank of Italy)',
      'Competition from established scoring bureaus (CRIF, Cerved)',
      'Long enterprise sales cycles with banks',
      'Dependence on stable open-banking data access',
    ],
    valuation_pre_money: 2_800_000,
    offer_target_eur: 280_000,
    offer_equity_percent: 8,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'live',
    logo_url: undefined,
    founders: [
      { name: 'Marco Greco', role: 'CEO', linkedin_url: 'https://linkedin.com/in/marcogreco', education: 'Bocconi University (MSc, Finance)', background: 'Ex-credit risk lead at a top-3 Italian bank; 10 years in SME underwriting' },
      { name: 'Sara Lombardi', role: 'CTO', linkedin_url: 'https://linkedin.com/in/saralombardi', education: 'Politecnico di Milano (MSc, Computer Science)', background: 'Former ML engineer at Generali; built risk models at scale' },
    ],
    accelerator: 'B4i — Bocconi for Innovation 2025',
    last_valuation_date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money set at €2.8M; reflects early ARR traction with 3 banking pilots',
    company_updates: [
      { date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Banco BPM signs Letter of Intent for SME scoring pilot', summary: 'Largest engagement to date; production rollout scheduled for Q3 2026' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '36 to 60 months' },
      { label: 'Trigger', value: 'ARR exceeds €3M with 10+ banks live' },
      { label: 'Trigger', value: 'Series B from a tier-1 fintech VC' },
      { label: 'Trigger', value: 'Acquisition by a tier-1 European bank' },
    ],
  },
  {
    id: 'deal-2',
    startup_name: 'Verdant Grid',
    industry: 'CleanTech',
    sector_type: 'B2B',
    country: 'Germany',
    website_url: 'https://verdantgrid.example.com',
    stage: 'seed',
    short_description: 'Software platform for industrial energy optimisation',
    long_description: 'Verdant Grid is a software platform for industrial energy optimisation. We reduce electricity consumption in manufacturing plants by 15-30% using ML models trained on plant-floor sensor data. Three enterprise clients are live — including BASF and a Bosch pilot — and the platform has secured €340K in EU Green Deal grants to accelerate its rollout across DACH and Benelux.',
    highlights: [
      '3 paying enterprise clients (BASF, Bosch pilot, mid-size steel plant)',
      'Average 22% energy cost reduction in live deployments',
      'EU Green Deal grants secured: €340K',
      'Founding team combines industrial automation and applied ML',
      'CE-aligned data architecture for EU manufacturing customers',
    ],
    risks: [
      'Long enterprise sales cycles (6-18 months)',
      'Hardware integration complexity varies by plant age',
      'Energy price volatility can change customer ROI calculus',
      'Competition from incumbents like Siemens and Schneider Electric',
    ],
    valuation_pre_money: 6_500_000,
    offer_target_eur: 520_000,
    offer_equity_percent: 6,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'upcoming',
    logo_url: undefined,
    founders: [
      { name: 'Lukas Hoffmann', role: 'CEO', linkedin_url: 'https://linkedin.com/in/lukashoffmann', education: 'TU Munich (MSc, Mechanical Engineering)', background: 'Ex-Siemens energy management; led plant-level efficiency programs' },
      { name: 'Hannah Becker', role: 'CTO', linkedin_url: 'https://linkedin.com/in/hannahbecker', education: 'RWTH Aachen (PhD, Industrial AI)', background: 'Published researcher on ML for energy systems; ex-Bosch Research' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '48 to 84 months' },
      { label: 'Trigger', value: '50+ industrial sites under contract' },
      { label: 'Trigger', value: 'Series B from an industrial-tech VC' },
      { label: 'Trigger', value: 'Strategic acquisition by an automation group' },
    ],
  },
  {
    id: 'deal-3',
    startup_name: 'MedFlow',
    industry: 'HealthTech',
    sector_type: 'B2B',
    country: 'Spain',
    website_url: 'https://medflow.example.com',
    stage: 'pre-seed',
    short_description: 'Digital triage platform for hospital emergency departments',
    long_description: 'MedFlow is a digital triage platform for hospital emergency departments. We reduce patient waiting times using predictive staffing models and an automated intake flow that prioritises patients by acuity. A pilot is live in two public hospitals in Catalonia, where average triage time dropped 38% in the first quarter.',
    highlights: [
      'Pilot running in 2 public hospitals in Catalonia',
      'Average triage time reduced by 38%',
      'Spanish Ministry of Health innovation grant recipient',
      'Founding team combines emergency medicine and product engineering',
      'GDPR and Spanish health-data compliant architecture',
    ],
    risks: [
      'Public healthcare procurement cycles are slow',
      'Data privacy compliance under GDPR and Spanish health law',
      'Hospital IT integrations vary across regions',
      'Limited pricing power in public-sector contracts',
    ],
    valuation_pre_money: 3_200_000,
    offer_target_eur: 320_000,
    offer_equity_percent: 9,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Dr. Elena Ruiz', role: 'CEO', linkedin_url: 'https://linkedin.com/in/elenaruiz', education: 'Universidad de Barcelona (MD, Emergency Medicine)', background: 'Practicing ED physician; 12 years in Catalan public hospitals' },
      { name: 'Pau Vidal', role: 'CTO', linkedin_url: 'https://linkedin.com/in/pauvidal', education: 'UPC Barcelona (MSc, Computer Science)', background: 'Ex-engineering lead at a Spanish health-data startup' },
    ],
    accelerator: 'Lanzadera 2024',
    last_valuation_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money set at €3.2M based on early traction with public hospitals',
    company_updates: [
      { date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), headline: 'MedFlow vault closed at target', summary: 'Funds deployed; team accelerating rollout to a 3rd Catalan hospital' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '3.5x' },
      { label: 'Preferred window', value: '48 to 72 months' },
      { label: 'Trigger', value: '20+ hospitals deployed across Spain' },
      { label: 'Trigger', value: 'Acquisition by a hospital group or health insurance provider' },
    ],
  },
  {
    id: 'deal-4',
    startup_name: 'Loopify',
    industry: 'E-commerce',
    sector_type: 'B2B',
    country: 'Netherlands',
    website_url: 'https://loopify.example.com',
    stage: 'seed',
    short_description: 'Reverse logistics infrastructure for fashion brands',
    long_description: 'Loopify is reverse logistics infrastructure for fashion brands. We turn returns into resale revenue instead of landfill, integrated directly into brand checkout flows. Loopify is live with 14 mid-size fashion brands across Benelux, has processed €2.1M in recovered resale value in Q1 2026, and operates a returns logistics partnership with PostNL.',
    highlights: [
      'Integrations with 14 mid-size fashion brands across Benelux',
      '€2.1M in recovered resale value processed in Q1 2026',
      'Partnership with PostNL for returns logistics',
      'Founding team from fashion DTC and logistics tech',
      'EU-aligned circular-economy data reporting',
    ],
    risks: [
      'Dependent on fashion retail health (cyclical)',
      'Competition from Zalando\'s own returns infrastructure',
      'Margins compressed by logistics costs',
      'Brand churn risk if resale cannibalises new sales',
    ],
    valuation_pre_money: 5_100_000,
    offer_target_eur: 400_000,
    offer_equity_percent: 7,
    min_ticket_eur: 200,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'live',
    logo_url: undefined,
    founders: [
      { name: 'Sanne de Wit', role: 'CEO', linkedin_url: 'https://linkedin.com/in/sannedewit', education: 'Erasmus University Rotterdam (MSc, Supply Chain Management)', background: 'Ex-Zalando partnerships lead; 8 years in fashion logistics' },
      { name: 'Ruben Smit', role: 'CTO', linkedin_url: 'https://linkedin.com/in/rubensmit', education: 'TU Delft (MSc, Software Engineering)', background: 'Built logistics platforms at a Dutch DTC unicorn' },
    ],
    accelerator: 'Rockstart Sustainability 2024',
    last_valuation_date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money set at €5.1M; reflects 7x recovered-value run-rate multiple',
    company_updates: [
      { date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Loopify signs PostNL partnership for returns logistics', summary: 'Nationwide returns coverage unlocked; rollout to all Benelux clients in Q2' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '36 to 60 months' },
      { label: 'Trigger', value: '50+ brands integrated across EU' },
      { label: 'Trigger', value: 'Strategic acquisition by a logistics or fashion marketplace player' },
    ],
  },
  {
    id: 'deal-5',
    startup_name: 'Polis AI',
    industry: 'B2B SaaS',
    sector_type: 'B2B',
    country: 'France',
    website_url: 'https://polisai.example.com',
    stage: 'pre-seed',
    short_description: 'AI assistant for local government administration',
    long_description: 'Polis AI is an AI assistant for local government administration. We automate permit processing, citizen query routing, and budget reporting for municipalities under 50,000 residents. Eight municipalities in Île-de-France are on paid annual contracts, with average 60% reduction in admin processing time and finalist status at the Grand Prix de l\'Innovation Publique 2025.',
    highlights: [
      '8 municipalities in Île-de-France on paid annual contracts',
      'Average 60% reduction in admin processing time',
      'Grand Prix de l\'Innovation Publique finalist 2025',
      'Founding team combines public administration and AI engineering',
      'Architecture aligned with French public-sector data rules',
    ],
    risks: [
      'Public sector budget constraints and procurement rules',
      'Change management resistance in legacy government offices',
      'Regulatory shifts on public-sector AI use',
      'Long sales cycles with municipal procurement',
    ],
    valuation_pre_money: 2_400_000,
    offer_target_eur: 250_000,
    offer_equity_percent: 10,
    min_ticket_eur: 500,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'live',
    logo_url: undefined,
    founders: [
      { name: 'Camille Laurent', role: 'CEO', linkedin_url: 'https://linkedin.com/in/camillelaurent', education: 'Sciences Po Paris (MSc, Public Affairs)', background: 'Former chief of staff at a French regional council; 7 years in municipal modernisation' },
      { name: 'Hugo Martin', role: 'CTO', linkedin_url: 'https://linkedin.com/in/hugomartin', education: 'Télécom Paris (MSc, Machine Learning)', background: 'Ex-Mistral AI engineer; specialist in domain-specific LLMs' },
    ],
    accelerator: 'Station F GovTech Track 2025',
    last_valuation_date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money at €2.4M; reflects 8 paid municipal contracts and public-sector pipeline',
    company_updates: [
      { date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Polis AI selected as finalist for Grand Prix de l\'Innovation Publique', summary: 'Recognition validates municipal AI use case across France' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '48 to 72 months' },
      { label: 'Trigger', value: '100+ municipalities on platform' },
      { label: 'Trigger', value: 'Acquisition by a GovTech consolidator or large consulting firm' },
    ],
  },
  {
    id: 'deal-6',
    startup_name: 'Stackr',
    industry: 'AI/ML',
    sector_type: 'B2B',
    country: 'Estonia',
    website_url: 'https://stackr.example.com',
    stage: 'seed',
    short_description: 'Automated code review and security scanning for dev teams',
    long_description: 'Stackr is an automated code review and security scanning platform for development teams. We detect vulnerabilities and suggest fixes in real time inside the IDE. Stackr powers 1,200 developer seats across 40 companies, runs at €38K MRR growing 18% month-over-month, and is SOC 2 Type II certified.',
    highlights: [
      '1,200 developer seats across 40 companies',
      'MRR: €38K, growing 18% month-over-month',
      'SOC 2 Type II certified',
      'Founding team from European DevTools and security backgrounds',
      'Native integrations with VS Code, JetBrains, and GitHub',
    ],
    risks: [
      'GitHub Copilot and similar tools expanding into security features',
      'Enterprise sales require security procurement approval',
      'Talent competition for security engineers',
      'Rapid evolution of LLM-based code tooling',
    ],
    valuation_pre_money: 7_200_000,
    offer_target_eur: 450_000,
    offer_equity_percent: 5,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'upcoming',
    logo_url: undefined,
    founders: [
      { name: 'Karl Tamm', role: 'CEO', linkedin_url: 'https://linkedin.com/in/karltamm', education: 'University of Tartu (MSc, Software Engineering)', background: 'Ex-Bolt engineering manager; built developer platform tooling' },
      { name: 'Mari Saar', role: 'CTO', linkedin_url: 'https://linkedin.com/in/marisaar', education: 'Tallinn University of Technology (MSc, Cybersecurity)', background: 'Former security engineer at Wise; specialist in static analysis' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [],
    exit_objectives: [
      { label: 'Target return', value: '5.0x' },
      { label: 'Preferred window', value: '36 to 60 months' },
      { label: 'Trigger', value: 'MRR exceeds €500K' },
      { label: 'Trigger', value: 'Acquisition by a DevOps platform (JetBrains, GitLab)' },
      { label: 'Trigger', value: 'Series A from a tier-1 VC' },
    ],
  },
  {
    id: 'deal-7',
    startup_name: 'Nutra',
    industry: 'HealthTech',
    sector_type: 'B2C',
    country: 'Sweden',
    website_url: 'https://nutra.example.com',
    stage: 'pre-seed',
    short_description: 'Personalised nutrition subscription with biomarker testing',
    long_description: 'Nutra is a personalised nutrition subscription platform combining blood biomarker testing with AI-generated supplement and meal protocols. With 4,200 active subscribers across the Nordics, an NPS of 72, and partnerships with three Nordic pharmacy chains for retail kits, Nutra is one of the fastest-growing wellness subscriptions in Scandinavia.',
    highlights: [
      '4,200 active subscribers across Nordics',
      'NPS: 72 — top quartile for health subscription',
      'Partnerships with 3 Nordic pharmacy chains for retail kits',
      'Founding team combines clinical nutrition and consumer subscriptions',
      'Biomarker testing through accredited Swedish lab',
    ],
    risks: [
      'Regulatory scrutiny on health claims in EU markets',
      'High customer acquisition cost in competitive wellness market',
      'Subscription churn risk after initial protocol period',
      'Lab capacity constraints if growth accelerates',
    ],
    valuation_pre_money: 3_800_000,
    offer_target_eur: 340_000,
    offer_equity_percent: 8,
    min_ticket_eur: 200,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Linnea Bergström', role: 'CEO', linkedin_url: 'https://linkedin.com/in/linneabergstrom', education: 'Karolinska Institute (MSc, Clinical Nutrition)', background: 'Former clinical nutritionist; 8 years in Nordic wellness sector' },
      { name: 'Oskar Nilsson', role: 'CTO', linkedin_url: 'https://linkedin.com/in/oskarnilsson', education: 'KTH Royal Institute of Technology (MSc, Computer Science)', background: 'Ex-Klarna engineer; built subscription and recommendation platforms' },
    ],
    accelerator: 'Antler Stockholm 2024',
    last_valuation_date: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money at €3.8M; supported by subscriber base and pharmacy retail partnerships',
    company_updates: [
      { date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Nutra retail kits launch in Apotek Hjärtat stores', summary: 'Nationwide Swedish retail rollout opens new acquisition channel' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.5x' },
      { label: 'Preferred window', value: '36 to 60 months' },
      { label: 'Trigger', value: '50K+ active subscribers across EU' },
      { label: 'Trigger', value: 'Acquisition by a pharma or wellness brand' },
    ],
  },
  {
    id: 'deal-8',
    startup_name: 'Civitas',
    industry: 'B2B',
    sector_type: 'B2B',
    country: 'Italy',
    website_url: 'https://civitas.example.com',
    stage: 'pre-seed',
    short_description: 'Public tender platform for Italian construction SMEs',
    long_description: 'Civitas is a digital platform connecting Italian construction SMEs with public tender opportunities. We handle documentation aggregation, compliance checks, and bid submission. The platform hosts 180 active construction firms, has supported €14M in successfully submitted public tenders, and operates in partnership with CNA (Confederazione Nazionale Artigianato).',
    highlights: [
      '180 active construction firms on platform',
      '€14M in public tenders successfully submitted via platform',
      'Partnership with CNA (Confederazione Nazionale Artigianato)',
      'Founding team combines public procurement law and engineering',
      'Compliance engine aligned with Italian Public Contracts Code',
    ],
    risks: [
      'Italian public tender process reform uncertainty',
      'Manual document requirements vary significantly by region',
      'Long onboarding for traditional construction SMEs',
      'Concentration risk on Italian public-sector demand',
    ],
    valuation_pre_money: 2_100_000,
    offer_target_eur: 240_000,
    offer_equity_percent: 11,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'upcoming',
    logo_url: undefined,
    founders: [
      { name: 'Federico Russo', role: 'CEO', linkedin_url: 'https://linkedin.com/in/federicorusso', education: 'LUISS Guido Carli (MSc, Public Procurement Law)', background: 'Former public procurement consultant; 9 years advising Italian construction SMEs' },
      { name: 'Giulia Conti', role: 'CTO', linkedin_url: 'https://linkedin.com/in/giuliaconti', education: 'Politecnico di Torino (MSc, Software Engineering)', background: 'Built compliance automation tools at an Italian legaltech startup' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '48 to 72 months' },
      { label: 'Trigger', value: '1,500+ construction firms on platform' },
      { label: 'Trigger', value: 'Acquisition by a legal-tech or government-platform company' },
    ],
  },
  {
    id: 'deal-9',
    startup_name: 'FreightOS Europe',
    industry: 'B2B',
    sector_type: 'B2B',
    country: 'Poland',
    website_url: 'https://freightos-eu.example.com',
    stage: 'seed',
    short_description: 'Digital freight brokerage for cross-border EU road freight',
    long_description: 'FreightOS Europe is a digital freight brokerage connecting Polish manufacturers with EU carriers. The platform offers real-time pricing, booking, and tracking for cross-border road freight. €8.2M in freight volume was brokered in 2025 across 320 active shipper accounts and 85 carrier partners. Expansion to Czech Republic and Hungary is planned for Q3 2026.',
    highlights: [
      '€8.2M in freight volume brokered in 2025',
      '320 active shipper accounts, 85 carrier partners',
      'Expanding to Czech Republic and Hungary in Q3 2026',
      'Ex-Sennder and ex-Polish logistics operator team',
      'Real-time tracking integrated with major TMS platforms',
    ],
    risks: [
      'Freight market is cyclical and margin-thin',
      'Competition from Sennder and Transporeon',
      'Carrier capacity volatility in CEE',
      'Fuel price exposure across cross-border lanes',
    ],
    valuation_pre_money: 5_800_000,
    offer_target_eur: 400_000,
    offer_equity_percent: 6,
    min_ticket_eur: 200,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Jakub Wójcik', role: 'CEO', linkedin_url: 'https://linkedin.com/in/jakubwojcik', education: 'SGH Warsaw School of Economics (MSc, Logistics)', background: 'Ex-Sennder country manager; 7 years in CEE freight' },
      { name: 'Magdalena Krawczyk', role: 'CTO', linkedin_url: 'https://linkedin.com/in/magdalenakrawczyk', education: 'Warsaw University of Technology (MSc, Computer Science)', background: 'Built marketplace platforms at a Polish e-commerce unicorn' },
    ],
    accelerator: 'Speedinvest Industrial Tech 2024',
    last_valuation_date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money at €5.8M; supported by brokerage take-rate run-rate and CEE expansion plan',
    company_updates: [
      { date: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(), headline: 'FreightOS Europe announces Czech and Hungarian expansion', summary: 'Local carrier sourcing teams hired in Prague and Budapest' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '3.5x' },
      { label: 'Preferred window', value: '48 to 84 months' },
      { label: 'Trigger', value: 'Annual brokered volume exceeds €60M' },
      { label: 'Trigger', value: 'Acquisition by a logistics group or IPO' },
    ],
  },
  {
    id: 'deal-10',
    startup_name: 'SolarDesk',
    industry: 'CleanTech',
    sector_type: 'B2B',
    country: 'Portugal',
    website_url: 'https://solardesk.example.com',
    stage: 'pre-seed',
    short_description: 'Operations platform for solar installation companies',
    long_description: 'SolarDesk is a B2B platform helping solar installation companies manage projects, permits, and customer billing. We replace spreadsheets for installers handling 20-200 projects per year. Ninety active solar installation companies are on the platform, mostly across Portugal and Spain, with average installer time savings of 6 hours per project.',
    highlights: [
      '90 active solar installation companies, mostly Portugal and Spain',
      'Average installer saves 6 hours per project on admin',
      'Backed by EDP Ventures accelerator program',
      'Founding team combines solar operations and SaaS engineering',
      'Permit-automation library covering 8 Iberian regional regimes',
    ],
    risks: [
      'Market fragmented — hard to scale beyond SME installers',
      'Solar incentive changes in target markets could slow installer growth',
      'Long sales cycles with traditional installer SMEs',
      'Limited pricing power on small installer accounts',
    ],
    valuation_pre_money: 1_900_000,
    offer_target_eur: 220_000,
    offer_equity_percent: 12,
    min_ticket_eur: 500,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Diogo Almeida', role: 'CEO', linkedin_url: 'https://linkedin.com/in/diogoalmeida', education: 'Universidade do Porto (MSc, Energy Engineering)', background: 'Former operations lead at an Iberian solar installer; managed 400+ installs' },
      { name: 'Rita Sousa', role: 'CTO', linkedin_url: 'https://linkedin.com/in/ritasousa', education: 'Instituto Superior Técnico (MSc, Computer Science)', background: 'Built operations SaaS at a Portuguese B2B startup' },
    ],
    accelerator: 'EDP Starter 2024',
    last_valuation_date: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money at €1.9M; supported by installer adoption and EDP Ventures backing',
    company_updates: [
      { date: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(), headline: 'SolarDesk crosses 90 installer accounts in Iberia', summary: 'Steady growth in Portuguese and Spanish installer base' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '48 to 72 months' },
      { label: 'Trigger', value: '500+ installer accounts across EU' },
      { label: 'Trigger', value: 'Acquisition by a solar manufacturer or energy-services company' },
    ],
  },
  {
    id: 'deal-11',
    startup_name: 'Krato',
    industry: 'Fintech',
    sector_type: 'B2B',
    country: 'Ireland',
    website_url: 'https://krato.example.com',
    stage: 'seed',
    short_description: 'Treasury management platform for European scale-ups',
    long_description: 'Krato is a treasury management platform for European scale-ups. We automate cash pooling, FX hedging, and multi-bank reconciliation for companies with €5-100M revenue. Twenty-two paying clients — including 4 Series B+ startups — save an average of €180K per year in FX costs. Krato is integrated with Revolut Business, Wise Business, and HSBC.',
    highlights: [
      '22 paying clients including 4 Series B+ startups',
      'Average €180K saved per client per year in FX costs',
      'Integrated with Revolut Business, Wise Business, HSBC',
      'Founding team combines corporate treasury and fintech engineering',
      'EU-aligned banking partnerships and PSD2 connectivity',
    ],
    risks: [
      'Enterprise fintech sales cycles are long',
      'Banking partnerships can be revoked if terms change',
      'Competition from incumbent ERP-treasury modules',
      'FX volatility can change customer ROI calculus',
    ],
    valuation_pre_money: 8_400_000,
    offer_target_eur: 500_000,
    offer_equity_percent: 5,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'filled',
    logo_url: undefined,
    founders: [
      { name: 'Aoife Doyle', role: 'CEO', linkedin_url: 'https://linkedin.com/in/aoifedoyle', education: 'Trinity College Dublin (MSc, Finance)', background: 'Former treasury manager at a European scale-up; 9 years in corporate finance' },
      { name: 'Sean Byrne', role: 'CTO', linkedin_url: 'https://linkedin.com/in/seanbyrne', education: 'University College Dublin (MSc, Computer Science)', background: 'Ex-Stripe engineer; built financial automation systems' },
    ],
    accelerator: 'NDRC Pre-Accelerator 2024',
    last_valuation_date: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money at €8.4M; reflects ARR with strong scale-up customer base',
    company_updates: [
      { date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Krato vault filled at target', summary: '€500K raised; team focusing on DACH expansion next quarter' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.5x' },
      { label: 'Preferred window', value: '36 to 72 months' },
      { label: 'Trigger', value: '100+ paying treasury clients across EU' },
      { label: 'Trigger', value: 'Acquisition by an ERP provider (SAP, NetSuite) or fintech platform' },
    ],
  },
  {
    id: 'deal-12',
    startup_name: 'Boltwork',
    industry: 'B2B SaaS',
    sector_type: 'B2B',
    country: 'Austria',
    website_url: 'https://boltwork.example.com',
    stage: 'pre-seed',
    short_description: 'Workforce scheduling for European hospitality and retail',
    long_description: 'Boltwork is a workforce scheduling platform for European hospitality and retail. We handle shift planning, compliance with local labor laws, and last-minute staff sourcing. Boltwork operates in 280 venues across Austria and Germany on paid plans, runs €22K MRR, and integrates with eight POS systems including Lightspeed and Square.',
    highlights: [
      '280 venues across Austria and Germany on paid plans',
      'MRR: €22K',
      'Integrates with 8 POS systems including Lightspeed and Square',
      'Founding team from European hospitality and HR-tech',
      'Compliance engine covering Austrian and German labor regulations',
    ],
    risks: [
      'Hospitality sector is seasonal and economically sensitive',
      'Competition from Planday (acquired by Xero)',
      'Local labor-law complexity slows EU expansion',
      'Dependent on POS partner stability',
    ],
    valuation_pre_money: 2_600_000,
    offer_target_eur: 270_000,
    offer_equity_percent: 9,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'failed',
    logo_url: undefined,
    founders: [
      { name: 'Felix Wagner', role: 'CEO', linkedin_url: 'https://linkedin.com/in/felixwagner', education: 'WU Vienna (MSc, Management)', background: 'Former operations lead at an Austrian hospitality group; managed 40+ venues' },
      { name: 'Lena Hofer', role: 'CTO', linkedin_url: 'https://linkedin.com/in/lenahofer', education: 'TU Wien (MSc, Software Engineering)', background: 'Ex-Personio engineer; built scheduling and compliance modules' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [
      { date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Boltwork vault did not reach target', summary: 'Funds returned to investors; team reassessing go-to-market' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '48 to 72 months' },
      { label: 'Trigger', value: '2,000+ venues on platform' },
    ],
  },
];

// ── POOLS ──────────────────────────────────────────────────────

const pool1End = new Date(now.getTime() + 38 * 60 * 60 * 1000);
const pool2Start = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
const pool2End = new Date(pool2Start.getTime() + 72 * 60 * 60 * 1000);

const pool4End = new Date(now.getTime() + 52 * 60 * 60 * 1000); // 52 h left
const pool5End = new Date(now.getTime() + 96 * 60 * 60 * 1000); // 4 days left
const pool6Start = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
const pool6End = new Date(pool6Start.getTime() + 72 * 60 * 60 * 1000);
const pool8Start = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
const pool8End = new Date(pool8Start.getTime() + 72 * 60 * 60 * 1000);

export const initialPools: Pool[] = [
  // Existing pools 1-3
  {
    id: 'pool-1', deal_id: 'deal-1', target_eur: 1_000_000, raised_eur: 620_000,
    start_datetime: new Date(now.getTime() - 34 * 60 * 60 * 1000).toISOString(),
    end_datetime: pool1End.toISOString(), investors_count: 127,
    fee_entry_percent: 2.0, fee_carry_percent: 2.0, pool_status: 'live',
  },
  {
    id: 'pool-2', deal_id: 'deal-2', target_eur: 500_000, raised_eur: 0,
    start_datetime: pool2Start.toISOString(), end_datetime: pool2End.toISOString(),
    investors_count: 0, fee_entry_percent: 2.0, fee_carry_percent: 2.0, pool_status: 'upcoming',
  },
  {
    id: 'pool-3', deal_id: 'deal-3', target_eur: 750_000, raised_eur: 750_000,
    start_datetime: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    investors_count: 245, fee_entry_percent: 2.0, fee_carry_percent: 2.0, pool_status: 'active',
  },

  // New pools 4-12
  {
    id: 'pool-4', deal_id: 'deal-4', target_eur: 1_200_000, raised_eur: 1_020_000,
    start_datetime: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
    end_datetime: pool4End.toISOString(), investors_count: 198,
    fee_entry_percent: 2.0, fee_carry_percent: 2.0, pool_status: 'live',
  },
  {
    id: 'pool-5', deal_id: 'deal-5', target_eur: 2_000_000, raised_eur: 800_000,
    start_datetime: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
    end_datetime: pool5End.toISOString(), investors_count: 64,
    fee_entry_percent: 2.5, fee_carry_percent: 2.0, pool_status: 'live',
  },
  {
    id: 'pool-6', deal_id: 'deal-6', target_eur: 400_000, raised_eur: 0,
    start_datetime: pool6Start.toISOString(), end_datetime: pool6End.toISOString(),
    investors_count: 0, fee_entry_percent: 2.0, fee_carry_percent: 2.5, pool_status: 'upcoming',
  },
  {
    id: 'pool-7', deal_id: 'deal-7', target_eur: 1_500_000, raised_eur: 1_500_000,
    start_datetime: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    investors_count: 312, fee_entry_percent: 2.0, fee_carry_percent: 2.0, pool_status: 'active',
  },
  {
    id: 'pool-8', deal_id: 'deal-8', target_eur: 300_000, raised_eur: 0,
    start_datetime: pool8Start.toISOString(), end_datetime: pool8End.toISOString(),
    investors_count: 0, fee_entry_percent: 2.0, fee_carry_percent: 2.5, pool_status: 'upcoming',
  },
  {
    id: 'pool-9', deal_id: 'deal-9', target_eur: 1_000_000, raised_eur: 1_000_000,
    start_datetime: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    investors_count: 178, fee_entry_percent: 2.0, fee_carry_percent: 2.0, pool_status: 'active',
  },
  {
    id: 'pool-10', deal_id: 'deal-10', target_eur: 2_500_000, raised_eur: 2_500_000,
    start_datetime: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(now.getTime() - 47 * 24 * 60 * 60 * 1000).toISOString(),
    investors_count: 89, fee_entry_percent: 2.5, fee_carry_percent: 2.0, pool_status: 'active',
  },
  {
    id: 'pool-11', deal_id: 'deal-11', target_eur: 800_000, raised_eur: 800_000,
    start_datetime: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    investors_count: 183, fee_entry_percent: 2.0, fee_carry_percent: 2.0, pool_status: 'settling',
  },
  {
    id: 'pool-12', deal_id: 'deal-12', target_eur: 350_000, raised_eur: 147_000,
    start_datetime: new Date(now.getTime() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    end_datetime: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    investors_count: 41, fee_entry_percent: 2.0, fee_carry_percent: 2.5, pool_status: 'failed',
  },
];

// ── USERS ──────────────────────────────────────────────────────

export const initialUser: User = {
  id: 'user-1',
  name: 'Alex Demo',
  email: 'alex@demo.com',
  risk_profile: 'balanced',
  kyc_status: 'verified',
  wallet_balance_eur: 25_000,
  created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  notification_preferences: { new_pools: true, portfolio_updates: true, marketplace_activity: true },
  pool_interests: { industries: ['Enterprise Software', 'Artificial Intelligence'], stages: ['seed', 'pre-seed'] },
};

export const mockSellerUser: User = {
  id: 'user-2',
  name: 'Maria Investor',
  email: 'maria@demo.com',
  risk_profile: 'aggressive',
  kyc_status: 'verified',
  wallet_balance_eur: 15_000,
  created_at: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  notification_preferences: { new_pools: true, portfolio_updates: true, marketplace_activity: true },
  pool_interests: { industries: ['Sustainable E-commerce'], stages: ['seed'] },
};

export const mockSellerUser3: User = {
  id: 'user-3',
  name: 'Lukas Richter',
  email: 'lukas@demo.com',
  risk_profile: 'balanced',
  kyc_status: 'verified',
  wallet_balance_eur: 40_000,
  created_at: new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  notification_preferences: { new_pools: true, portfolio_updates: true, marketplace_activity: true },
  pool_interests: { industries: ['Cybersecurity', 'BioTech'], stages: ['seed', 'series-a'] },
};

// ── POSITIONS ──────────────────────────────────────────────────

export const initialPositions: Position[] = [
  // Existing positions
  {
    id: 'pos-1', user_id: 'user-1', pool_id: 'pool-3',
    invested_eur: 10_000, ownership_percent_of_spv: (10_000 / 750_000) * 10,
    current_estimated_value_eur: 12_500, lockup: false, is_listed_on_market: false,
    created_at: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pos-2', user_id: 'user-2', pool_id: 'pool-3',
    invested_eur: 15_000, ownership_percent_of_spv: (15_000 / 750_000) * 10,
    current_estimated_value_eur: 18_750, lockup: false, is_listed_on_market: true,
    created_at: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // New positions for demo user (enriches Portfolio page)
  {
    id: 'pos-3', user_id: 'user-1', pool_id: 'pool-7',
    invested_eur: 5_000, ownership_percent_of_spv: (5_000 / 1_500_000) * 10,
    current_estimated_value_eur: 6_200, lockup: false, is_listed_on_market: false,
    created_at: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pos-4', user_id: 'user-1', pool_id: 'pool-9',
    invested_eur: 8_000, ownership_percent_of_spv: (8_000 / 1_000_000) * 9,
    current_estimated_value_eur: 9_400, lockup: false, is_listed_on_market: false,
    created_at: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pos-5', user_id: 'user-1', pool_id: 'pool-10',
    invested_eur: 15_000, ownership_percent_of_spv: (15_000 / 2_500_000) * 7,
    current_estimated_value_eur: 16_800, lockup: false, is_listed_on_market: false,
    created_at: new Date(now.getTime() - 47 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Positions for other sellers (for marketplace listings)
  {
    id: 'pos-6', user_id: 'user-3', pool_id: 'pool-7',
    invested_eur: 12_000, ownership_percent_of_spv: (12_000 / 1_500_000) * 10,
    current_estimated_value_eur: 14_900, lockup: false, is_listed_on_market: true,
    created_at: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pos-7', user_id: 'user-2', pool_id: 'pool-9',
    invested_eur: 6_000, ownership_percent_of_spv: (6_000 / 1_000_000) * 9,
    current_estimated_value_eur: 7_100, lockup: false, is_listed_on_market: true,
    created_at: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pos-8', user_id: 'user-3', pool_id: 'pool-10',
    invested_eur: 20_000, ownership_percent_of_spv: (20_000 / 2_500_000) * 7,
    current_estimated_value_eur: 22_400, lockup: false, is_listed_on_market: true,
    created_at: new Date(now.getTime() - 47 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ── MARKETPLACE LISTINGS ───────────────────────────────────────

export const initialListings: MarketplaceListing[] = [
  // Existing
  {
    id: 'listing-1', seller_user_id: 'user-2', pool_id: 'pool-3', position_id: 'pos-2',
    percent_of_position_for_sale: 50, ask_price_eur: 10_000,
    created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active', fee_marketplace_percent: 1.0,
  },
  // New listings
  {
    id: 'listing-2', seller_user_id: 'user-3', pool_id: 'pool-7', position_id: 'pos-6',
    percent_of_position_for_sale: 30, ask_price_eur: 4_800,
    created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active', fee_marketplace_percent: 1.0,
  },
  {
    id: 'listing-3', seller_user_id: 'user-2', pool_id: 'pool-9', position_id: 'pos-7',
    percent_of_position_for_sale: 100, ask_price_eur: 7_500,
    created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active', fee_marketplace_percent: 1.0,
  },
  {
    id: 'listing-4', seller_user_id: 'user-3', pool_id: 'pool-10', position_id: 'pos-8',
    percent_of_position_for_sale: 25, ask_price_eur: 6_000,
    created_at: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active', fee_marketplace_percent: 1.0,
  },
];

// ── TRANSACTIONS ───────────────────────────────────────────────

export const initialTransactions: Transaction[] = [
  // Existing
  {
    id: 'tx-1', user_id: 'user-1', type: 'deposit', amount_eur: 35_000,
    timestamp: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { notes: 'Initial deposit' },
  },
  {
    id: 'tx-2', user_id: 'user-1', type: 'invest', amount_eur: -10_000,
    timestamp: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { pool_id: 'pool-3', notes: 'Investment in GreenCommerce' },
  },
  {
    id: 'tx-3', user_id: 'user-1', type: 'fee', amount_eur: -200,
    timestamp: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { pool_id: 'pool-3', notes: '2% entry fee' },
  },
  // New transactions for new positions
  {
    id: 'tx-4', user_id: 'user-1', type: 'invest', amount_eur: -5_000,
    timestamp: new Date(now.getTime() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { pool_id: 'pool-7', notes: 'Investment in CloudShield' },
  },
  {
    id: 'tx-5', user_id: 'user-1', type: 'invest', amount_eur: -8_000,
    timestamp: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { pool_id: 'pool-9', notes: 'Investment in LogiRoute' },
  },
  {
    id: 'tx-6', user_id: 'user-1', type: 'invest', amount_eur: -15_000,
    timestamp: new Date(now.getTime() - 47 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { pool_id: 'pool-10', notes: 'Investment in BioNova' },
  },
];

// ── NOTIFICATIONS ──────────────────────────────────────────────

export const initialNotifications: Notification[] = [
  // Existing
  {
    id: 'notif-1', user_id: 'user-1', title: 'New Pool Live!',
    message: 'TechFlow SaaS pool is now live. 72 hours to invest.',
    read: false, created_at: new Date(now.getTime() - 34 * 60 * 60 * 1000).toISOString(), type: 'pool',
  },
  {
    id: 'notif-2', user_id: 'user-1', title: 'Portfolio Update',
    message: 'GreenCommerce valuation increased by 25%',
    read: true, created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'portfolio',
  },
  {
    id: 'notif-3', user_id: 'user-1', title: 'Resale Board Activity',
    message: 'New listing available for GreenCommerce shares',
    read: false, created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'marketplace',
  },
  // New notifications
  {
    id: 'notif-4', user_id: 'user-1', title: 'New Pool Live!',
    message: 'Paylo vault is now live — 85% funded. Don\'t miss it.',
    read: false, created_at: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(), type: 'pool',
  },
  {
    id: 'notif-5', user_id: 'user-1', title: 'New Pool Live!',
    message: 'MediScan Series A vault is open. 40% funded so far.',
    read: false, created_at: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(), type: 'pool',
  },
  {
    id: 'notif-6', user_id: 'user-1', title: 'Upcoming Vault',
    message: 'FarmStack vault opens in 5 days. Add it to your watchlist.',
    read: true, created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'pool',
  },
  {
    id: 'notif-7', user_id: 'user-1', title: 'Portfolio Update',
    message: 'CloudShield signed its largest enterprise deal — position value updated.',
    read: false, created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), type: 'portfolio',
  },
];

// ── OFFERS ─────────────────────────────────────────────────────

export const initialOffers: MarketplaceOffer[] = [];
