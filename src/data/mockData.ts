import { StartupDeal, Pool, User, Position, MarketplaceListing, Transaction, Notification, MarketplaceOffer } from '@/types';

const now = new Date();

// Demo startup deals
export const initialDeals: StartupDeal[] = [
  {
    id: 'deal-1',
    startup_name: 'TechFlow SaaS',
    industry: 'Enterprise Software',
    sector_type: 'B2B',
    country: 'Italy',
    website_url: 'https://techflow.example.com',
    stage: 'seed',
    short_description: 'AI-powered workflow automation for SMEs',
    long_description: 'TechFlow is revolutionizing how small and medium enterprises manage their workflows. Our AI-powered platform automates repetitive tasks, integrates with existing tools, and provides actionable insights to boost productivity by up to 40%. Founded by ex-Google engineers, we have already onboarded 150+ paying customers across Europe.',
    highlights: [
      '€2.1M ARR with 180% YoY growth',
      '150+ paying enterprise customers',
      'Team of 25 with ex-Google, ex-Salesforce leadership',
      'Patent-pending AI technology',
      'SOC2 Type II certified',
    ],
    risks: [
      'Competitive market with established players',
      'Customer concentration risk (top 5 clients = 35% revenue)',
      'Dependent on key engineering talent',
      'Regulatory changes in AI/data privacy',
    ],
    valuation_pre_money: 10_000_000,
    offer_target_eur: 1_000_000,
    offer_equity_percent: 10,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'live',
    logo_url: undefined,
    founders: [
      { name: 'Marco Rossi', role: 'CEO', linkedin_url: 'https://linkedin.com/in/marcorossi', education: 'Politecnico di Milano (MSc, Computer Engineering)', background: 'Ex-Google PM; scaled B2B SaaS teams across EU' },
      { name: 'Elena Bianchi', role: 'CTO', linkedin_url: 'https://linkedin.com/in/elenabianchi', education: 'University of Bologna (MSc, AI & Machine Learning)', background: 'Ex-Salesforce engineer; led platform reliability & ML pipelines' },
    ],
    accelerator: 'Techstars Milan 2023',
    last_valuation_date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money valuation set at €10M based on 5x ARR multiple',
    company_updates: [
      { date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), headline: 'TechFlow partners with SAP for integration', summary: 'New partnership expands enterprise reach across DACH region' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '3.0x' },
      { label: 'Preferred window', value: '24 to 60 months' },
      { label: 'Trigger', value: 'Revenue growth of 4x or more' },
      { label: 'Trigger', value: 'Qualified secondary sale at or above current valuation' },
      { label: 'Trigger', value: 'Acquisition offer above €30M' },
    ],
  },
  {
    id: 'deal-2',
    startup_name: 'NeuralAI',
    industry: 'Artificial Intelligence',
    sector_type: 'B2B',
    country: 'Germany',
    website_url: 'https://neuralai.example.com',
    stage: 'pre-seed',
    short_description: 'Next-gen computer vision for industrial quality control',
    long_description: 'NeuralAI develops cutting-edge computer vision systems for industrial quality control. Our proprietary algorithms can detect defects invisible to the human eye with 99.7% accuracy. We are targeting the €15B quality control market, starting with automotive and electronics manufacturing.',
    highlights: [
      'Founding team from Max Planck Institute',
      '3 pilot programs with Fortune 500 manufacturers',
      'Patent filed for core detection algorithm',
      '€350K grant from German Federal Ministry',
      'First revenue expected Q2 2024',
    ],
    risks: [
      'Pre-revenue stage company',
      'Long enterprise sales cycles',
      'Hardware dependency for edge deployment',
      'Competition from incumbents like Cognex',
    ],
    valuation_pre_money: 5_000_000,
    offer_target_eur: 500_000,
    offer_equity_percent: 10,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'upcoming',
    logo_url: undefined,
    founders: [
      { name: 'Dr. Hans Mueller', role: 'CEO', linkedin_url: 'https://linkedin.com/in/hansmueller', education: 'PhD, Computer Vision (TU Munich)', background: 'Former head of ML at an automotive Tier-1 supplier' },
      { name: 'Dr. Anna Schmidt', role: 'Chief Scientist', linkedin_url: 'https://linkedin.com/in/annaschmidt', education: 'PhD, Applied AI (Max Planck Institute)', background: 'Published 30+ papers on industrial CV and anomaly detection' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '36 to 72 months' },
      { label: 'Trigger', value: 'Fleet expansion to 500+ vehicles' },
      { label: 'Trigger', value: 'Series B at 3x or higher valuation' },
    ],
  },
  {
    id: 'deal-3',
    startup_name: 'GreenCommerce',
    industry: 'Sustainable E-commerce',
    sector_type: 'B2C',
    country: 'Netherlands',
    website_url: 'https://greencommerce.example.com',
    stage: 'seed',
    short_description: 'Carbon-neutral marketplace for sustainable products',
    long_description: 'GreenCommerce is the leading marketplace for certified sustainable products in Europe. We verify every seller\'s environmental credentials and offset 100% of shipping emissions. With 50K+ monthly active buyers and 800+ verified brands, we are scaling rapidly.',
    highlights: [
      '€4.5M GMV in last 12 months',
      '50K monthly active buyers',
      '800+ verified sustainable brands',
      'Carbon neutral certified operations',
      'Series A discussions underway',
    ],
    risks: [
      'Marketplace unit economics still proving out',
      'Sustainability verification costs',
      'Competition from Amazon Climate Pledge',
      'Consumer willingness to pay premium',
    ],
    valuation_pre_money: 7_500_000,
    offer_target_eur: 750_000,
    offer_equity_percent: 10,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Sophie van der Berg', role: 'CEO', linkedin_url: 'https://linkedin.com/in/sophievdberg', education: 'Erasmus University Rotterdam (MSc, Business & Sustainability)', background: 'Built EU supply-chain partnerships; ex-Unilever sustainability team' },
      { name: 'Jan de Vries', role: 'COO', linkedin_url: 'https://linkedin.com/in/jandevries', education: 'TU Delft (MSc, Industrial Engineering)', background: 'Ops leader in marketplaces; scaled logistics across Benelux' },
      { name: 'Lisa Jansen', role: 'CMO', linkedin_url: 'https://linkedin.com/in/lisajansen', education: 'University of Amsterdam (MSc, Marketing)', background: 'Growth marketing in DTC; led acquisition at 2 European e-com brands' },
    ],
    accelerator: 'Y Combinator W23',
    last_valuation_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Valuation increased 25% following Series A interest at €15M',
    company_updates: [
      { date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), headline: 'GreenCommerce raises Series A interest at €15M valuation', summary: 'Multiple VCs expressing interest, valuation up 25% from seed round' },
      { date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Marketplace hits 50K monthly active buyers', summary: 'Growth accelerates as more consumers prioritize sustainable shopping' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '5.0x' },
      { label: 'Preferred window', value: '36 to 60 months' },
      { label: 'Trigger', value: 'Regulated status obtained in 2+ EU markets' },
      { label: 'Trigger', value: 'Acquisition offer from established financial institution' },
    ],
  },

  // ── NEW DEALS 4-12 ──────────────────────────────────────────────

  {
    id: 'deal-4',
    startup_name: 'Paylo',
    industry: 'Fintech',
    sector_type: 'B2B',
    country: 'France',
    website_url: 'https://paylo.example.com',
    stage: 'seed',
    short_description: 'Instant B2B cross-border payments for European SMEs',
    long_description: 'Paylo eliminates the pain of cross-border B2B payments. Our API-first platform settles invoices in real time across 30+ European markets, cutting transaction costs by up to 70% compared to legacy banks. Built on open-banking rails, Paylo already processes €18M in monthly volume for 400+ SME clients.',
    highlights: [
      '€18M monthly payment volume processed',
      '400+ SME clients across 12 EU countries',
      'Licensed as an e-money institution in France',
      'Integration partnerships with Xero and Sage',
      'Team includes ex-Stripe and ex-Adyen engineers',
    ],
    risks: [
      'Regulatory complexity across multiple EU jurisdictions',
      'Dependent on open-banking API stability',
      'Pricing pressure from larger fintech players',
      'FX exposure on cross-border settlements',
    ],
    valuation_pre_money: 12_000_000,
    offer_target_eur: 1_200_000,
    offer_equity_percent: 10,
    min_ticket_eur: 200,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'live',
    logo_url: undefined,
    founders: [
      { name: 'Antoine Dupont', role: 'CEO', linkedin_url: 'https://linkedin.com/in/antoinedupont', education: 'HEC Paris (MBA)', background: 'Ex-Stripe BD lead for Southern Europe; 8 years in payments' },
      { name: 'Claire Moreau', role: 'CTO', linkedin_url: 'https://linkedin.com/in/clairemoreau', education: 'École Polytechnique (MSc, Applied Mathematics)', background: 'Ex-Adyen platform engineer; built real-time settlement systems' },
      { name: 'Julien Petit', role: 'CFO', linkedin_url: 'https://linkedin.com/in/julienpetit', education: 'ESSEC Business School (MSc, Finance)', background: 'Former VP Finance at a Series C neobank; led licensing process' },
    ],
    accelerator: '500 Global Batch 32',
    last_valuation_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money set at €12M; reflects 8x revenue multiple on annualised take-rate',
    company_updates: [
      { date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Paylo obtains e-money licence in France', summary: 'Regulatory milestone unlocks direct settlement without banking partners' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '24 to 48 months' },
      { label: 'Trigger', value: 'Monthly volume exceeds €100M' },
      { label: 'Trigger', value: 'Series B at 3x+ valuation uplift' },
      { label: 'Trigger', value: 'Acquisition offer from a top-10 EU bank' },
    ],
  },
  {
    id: 'deal-5',
    startup_name: 'MediScan',
    industry: 'HealthTech',
    sector_type: 'B2B2C',
    country: 'Spain',
    website_url: 'https://mediscan.example.com',
    stage: 'series-a',
    short_description: 'AI-assisted radiology diagnostics for hospitals',
    long_description: 'MediScan brings AI-powered diagnostic assistance to radiology departments across Europe. Our platform analyses CT, MRI, and X-ray images in under 60 seconds, flagging anomalies with 97% sensitivity. Currently deployed in 35 hospitals across Spain and Portugal, MediScan reduces radiologist workload by 30% while improving early detection rates.',
    highlights: [
      'CE-marked Class IIa medical device',
      '35 hospital deployments across Iberia',
      '€3.2M ARR with 120% net revenue retention',
      'Clinical validation published in The Lancet Digital Health',
      'Pipeline of 80+ hospitals in DACH and Nordics',
    ],
    risks: [
      'Long regulatory approval cycles in new markets',
      'Reimbursement model uncertainty in some EU countries',
      'Dependence on hospital IT procurement budgets',
      'Liability exposure from diagnostic recommendations',
    ],
    valuation_pre_money: 25_000_000,
    offer_target_eur: 2_000_000,
    offer_equity_percent: 8,
    min_ticket_eur: 500,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'live',
    logo_url: undefined,
    founders: [
      { name: 'Dr. Carlos Fernández', role: 'CEO', linkedin_url: 'https://linkedin.com/in/carlosfernandez', education: 'Universidad de Barcelona (MD, Radiology)', background: 'Practicing radiologist turned founder; 15 years clinical experience' },
      { name: 'María García', role: 'CTO', linkedin_url: 'https://linkedin.com/in/mariagarcia', education: 'Universidad Politécnica de Madrid (PhD, Biomedical Engineering)', background: 'Ex-Philips Healthcare; built FDA-cleared imaging algorithms' },
    ],
    accelerator: 'Techstars Healthcare 2022',
    last_valuation_date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Series A pre-money at €25M; based on 8x ARR with clinical traction premium',
    company_updates: [
      { date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), headline: 'MediScan signs framework agreement with German hospital group', summary: '12 hospitals in Bavaria to begin pilot deployments in Q2' },
      { date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Clinical study published in The Lancet Digital Health', summary: 'Peer-reviewed validation shows 97% sensitivity in lung nodule detection' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '3.5x' },
      { label: 'Preferred window', value: '36 to 60 months' },
      { label: 'Trigger', value: 'Deployment in 200+ hospitals' },
      { label: 'Trigger', value: 'Series B at €75M+ valuation' },
      { label: 'Trigger', value: 'Strategic acquisition by medical imaging incumbent' },
    ],
  },
  {
    id: 'deal-6',
    startup_name: 'FarmStack',
    industry: 'AgriTech',
    sector_type: 'B2B',
    country: 'Ireland',
    website_url: 'https://farmstack.example.com',
    stage: 'pre-seed',
    short_description: 'Precision agriculture platform for European dairy farms',
    long_description: 'FarmStack combines IoT sensors, satellite imagery, and machine learning to help dairy farmers optimise herd health, pasture management, and milk yield. Our platform has been piloted on 25 farms in Ireland and the UK, delivering an average 15% increase in productivity. We are preparing for commercial launch across Northern Europe.',
    highlights: [
      '25 pilot farms with measurable productivity gains',
      'Partnership with Teagasc (Irish Agriculture Authority)',
      '€200K pre-seed from agri-focused angels',
      'Founding team combines agri-science and deep tech',
      'Patent pending on soil-moisture prediction model',
    ],
    risks: [
      'Pre-revenue with no proven unit economics',
      'Hardware logistics complexity for sensor rollout',
      'Farmer adoption rates can be slow',
      'Seasonal revenue patterns in agriculture',
    ],
    valuation_pre_money: 3_000_000,
    offer_target_eur: 400_000,
    offer_equity_percent: 12,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'upcoming',
    logo_url: undefined,
    founders: [
      { name: 'Aoife O\'Brien', role: 'CEO', linkedin_url: 'https://linkedin.com/in/aoifeobrien', education: 'University College Dublin (MSc, Agricultural Science)', background: 'Third-generation dairy farmer; led Teagasc innovation programs' },
      { name: 'Cian Murphy', role: 'CTO', linkedin_url: 'https://linkedin.com/in/cianmurphy', education: 'Trinity College Dublin (MSc, Computer Science)', background: 'Ex-IBM Research; IoT and edge computing specialist' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [],
    exit_objectives: [
      { label: 'Target return', value: '5.0x' },
      { label: 'Preferred window', value: '48 to 84 months' },
      { label: 'Trigger', value: '1,000+ farms on-platform' },
      { label: 'Trigger', value: 'Series A at 4x valuation uplift' },
    ],
  },
  {
    id: 'deal-7',
    startup_name: 'CloudShield',
    industry: 'Cybersecurity',
    sector_type: 'B2B',
    country: 'Estonia',
    website_url: 'https://cloudshield.example.com',
    stage: 'seed',
    short_description: 'Zero-trust cloud security for mid-market enterprises',
    long_description: 'CloudShield provides a zero-trust security platform purpose-built for mid-market companies migrating to the cloud. Our agent-less architecture deploys in minutes, providing real-time threat detection, compliance monitoring, and automated incident response. With 90+ enterprise clients and SOC2 + ISO 27001 certification, CloudShield is the fastest-growing cloud security startup in the Baltics.',
    highlights: [
      '€1.8M ARR growing at 200% YoY',
      '90+ enterprise clients across Baltics and Nordics',
      'SOC2 Type II and ISO 27001 certified',
      'Agent-less deployment: live in under 15 minutes',
      'Won NATO DIANA cybersecurity accelerator',
    ],
    risks: [
      'Crowded cybersecurity market with well-funded competitors',
      'Enterprise sales cycles can exceed 6 months',
      'Talent competition for security engineers',
      'Rapid technology evolution requires constant R&D investment',
    ],
    valuation_pre_money: 15_000_000,
    offer_target_eur: 1_500_000,
    offer_equity_percent: 10,
    min_ticket_eur: 200,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Kristjan Tamm', role: 'CEO', linkedin_url: 'https://linkedin.com/in/kristjantamm', education: 'Tallinn University of Technology (MSc, Cybersecurity)', background: 'Ex-NATO Cooperative Cyber Defence Centre; built Estonia\'s threat intel platform' },
      { name: 'Liisa Kask', role: 'CTO', linkedin_url: 'https://linkedin.com/in/liisakask', education: 'University of Tartu (MSc, Computer Science)', background: 'Ex-CrowdStrike engineer; 10 years in endpoint detection' },
      { name: 'Andres Rebane', role: 'VP Sales', linkedin_url: 'https://linkedin.com/in/andresrebane', education: 'Stockholm School of Economics (MBA)', background: 'Enterprise sales at Palo Alto Networks; built Nordic channel from scratch' },
    ],
    accelerator: 'NATO DIANA 2023',
    last_valuation_date: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Seed round closed at €15M pre-money; reflects 8x ARR with security premium',
    company_updates: [
      { date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), headline: 'CloudShield wins largest Baltic enterprise deal', summary: 'Multi-year contract with a Top-3 Baltic bank worth €600K ARR' },
      { date: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Seed round fully subscribed', summary: '€1.5M raised in 48 hours from institutional and retail investors' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '30 to 60 months' },
      { label: 'Trigger', value: 'ARR exceeds €10M' },
      { label: 'Trigger', value: 'Series A at 4x+ valuation' },
      { label: 'Trigger', value: 'Acquisition by a top-20 global cybersecurity company' },
    ],
  },
  {
    id: 'deal-8',
    startup_name: 'EduVerse',
    industry: 'EdTech',
    sector_type: 'B2C',
    country: 'Portugal',
    website_url: 'https://eduverse.example.com',
    stage: 'pre-seed',
    short_description: 'Immersive language learning through VR experiences',
    long_description: 'EduVerse reimagines language learning by placing students inside realistic VR scenarios — ordering coffee in Paris, negotiating in Tokyo, or navigating a market in Marrakech. Our adaptive AI adjusts difficulty in real-time based on pronunciation, vocabulary, and confidence metrics. Currently in beta with 2,000 active learners and a partnership with a major Portuguese university.',
    highlights: [
      '2,000 beta users with 85% weekly retention',
      'Partnership with Universidade de Lisboa for research validation',
      'Supports 8 languages with 40+ immersive scenarios',
      '€150K grant from Portugal 2020 innovation fund',
      'Founding team combines linguistics, VR, and AI expertise',
    ],
    risks: [
      'VR hardware adoption still niche for consumers',
      'High content production cost for new scenarios',
      'Unproven willingness to pay at scale',
      'Competition from established language apps (Duolingo, Babbel)',
    ],
    valuation_pre_money: 2_500_000,
    offer_target_eur: 300_000,
    offer_equity_percent: 12,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'upcoming',
    logo_url: undefined,
    founders: [
      { name: 'Miguel Santos', role: 'CEO', linkedin_url: 'https://linkedin.com/in/miguelsantos', education: 'Universidade de Lisboa (PhD, Applied Linguistics)', background: 'Former language program director; published researcher in immersive learning' },
      { name: 'Ana Oliveira', role: 'CTO', linkedin_url: 'https://linkedin.com/in/anaoliveira', education: 'Instituto Superior Técnico (MSc, Computer Graphics)', background: 'Ex-Unity Technologies; shipped 3 commercial VR titles' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [],
    exit_objectives: [
      { label: 'Target return', value: '6.0x' },
      { label: 'Preferred window', value: '48 to 84 months' },
      { label: 'Trigger', value: '100K paying subscribers' },
      { label: 'Trigger', value: 'Series A at 5x+ valuation' },
    ],
  },
  {
    id: 'deal-9',
    startup_name: 'LogiRoute',
    industry: 'Logistics',
    sector_type: 'B2B2C',
    country: 'Poland',
    website_url: 'https://logiroute.example.com',
    stage: 'seed',
    short_description: 'AI-powered last-mile delivery optimisation',
    long_description: 'LogiRoute uses machine learning to optimise last-mile delivery routes in real time, reducing fuel costs by 25% and delivery times by 18%. Our platform integrates with major e-commerce backends and fleet management systems. Currently serving 60+ logistics companies across Poland, Czech Republic, and Slovakia with €1.4M in ARR.',
    highlights: [
      '€1.4M ARR with 150% YoY growth',
      '60+ logistics company clients',
      'Average 25% fuel cost reduction for clients',
      'Integration partnerships with Shopify and WooCommerce',
      'Ex-Amazon and ex-DHL founding team',
    ],
    risks: [
      'Market dominated by well-funded incumbents (Route4Me, OptimoRoute)',
      'Expansion requires local logistics expertise per market',
      'Dependent on accurate mapping data from third parties',
      'Electric vehicle transition may change cost dynamics',
    ],
    valuation_pre_money: 11_000_000,
    offer_target_eur: 1_000_000,
    offer_equity_percent: 9,
    min_ticket_eur: 200,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Piotr Kowalski', role: 'CEO', linkedin_url: 'https://linkedin.com/in/piotrkowalski', education: 'Warsaw University of Technology (MSc, Operations Research)', background: 'Ex-Amazon logistics; built routing systems for Central Europe' },
      { name: 'Marta Zielinska', role: 'CTO', linkedin_url: 'https://linkedin.com/in/martazielinska', education: 'AGH University of Science and Technology (MSc, AI)', background: 'Ex-DHL Innovation Lab; specialised in fleet optimisation algorithms' },
      { name: 'Tomasz Nowak', role: 'COO', linkedin_url: 'https://linkedin.com/in/tomasznowak', education: 'SGH Warsaw School of Economics (MBA)', background: 'Scaled operations at InPost; managed 5,000+ parcel lockers' },
    ],
    accelerator: 'Y Combinator S23',
    last_valuation_date: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Seed round at €11M pre-money; reflects 8x ARR with strong CEE traction',
    company_updates: [
      { date: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString(), headline: 'LogiRoute expands to Czech Republic and Slovakia', summary: 'CEE expansion on track; 15 new clients signed in first month' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.0x' },
      { label: 'Preferred window', value: '30 to 54 months' },
      { label: 'Trigger', value: 'ARR exceeds €8M' },
      { label: 'Trigger', value: 'Expansion to 10+ EU markets' },
      { label: 'Trigger', value: 'Series B at 4x valuation uplift' },
    ],
  },
  {
    id: 'deal-10',
    startup_name: 'BioNova',
    industry: 'BioTech',
    sector_type: 'B2B',
    country: 'Switzerland',
    website_url: 'https://bionova.example.com',
    stage: 'series-a',
    short_description: 'Synthetic biology platform for sustainable ingredients',
    long_description: 'BioNova uses synthetic biology to produce high-value ingredients traditionally sourced from petrochemicals or rare plants. Our proprietary fermentation platform can produce fragrances, flavours, and cosmetic actives at 60% lower cost with 90% less environmental impact. We have secured offtake agreements with 3 global FMCG companies and are scaling production at our pilot facility near Basel.',
    highlights: [
      '3 offtake agreements with global FMCG companies',
      'Pilot production facility operational near Basel',
      '€5.1M ARR from first commercial products',
      '12 patents granted across EU and US',
      'Team includes 4 PhDs from ETH Zurich and EPFL',
    ],
    risks: [
      'Scale-up from pilot to commercial production is capital intensive',
      'Regulatory approval timelines for novel ingredients',
      'Customer concentration in early revenue',
      'Synthetic biology consumer perception challenges',
    ],
    valuation_pre_money: 35_000_000,
    offer_target_eur: 2_500_000,
    offer_equity_percent: 7,
    min_ticket_eur: 500,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'closed',
    logo_url: undefined,
    founders: [
      { name: 'Dr. Lukas Weber', role: 'CEO', linkedin_url: 'https://linkedin.com/in/lukasweber', education: 'ETH Zurich (PhD, Synthetic Biology)', background: 'Post-doc at MIT Media Lab; 3 prior biotech ventures' },
      { name: 'Dr. Sarah Meier', role: 'CSO', linkedin_url: 'https://linkedin.com/in/sarahmeier', education: 'EPFL (PhD, Chemical Engineering)', background: 'Ex-Givaudan R&D; led flavour innovation for 8 years' },
      { name: 'Thomas Brunner', role: 'CFO', linkedin_url: 'https://linkedin.com/in/thomasbrunner', education: 'University of St. Gallen (MBA, Finance)', background: 'Former biotech equity analyst at UBS; led 4 IPO processes' },
    ],
    accelerator: 'Techstars Sustainability 2022',
    last_valuation_date: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Series A at €35M pre-money; strategic premium for IP portfolio and offtake agreements',
    company_updates: [
      { date: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(), headline: 'BioNova secures 4th offtake agreement with L\'Oréal', summary: 'Multi-year supply contract for sustainable fragrance ingredients' },
      { date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(), headline: 'Pilot facility reaches 80% production capacity', summary: 'Scale-up ahead of schedule; commercial facility planning underway' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '3.0x' },
      { label: 'Preferred window', value: '36 to 72 months' },
      { label: 'Trigger', value: 'Commercial facility operational' },
      { label: 'Trigger', value: 'Revenue exceeds €20M' },
      { label: 'Trigger', value: 'Series B at €100M+ valuation' },
      { label: 'Trigger', value: 'Acquisition by a top-10 ingredients company' },
    ],
  },
  {
    id: 'deal-11',
    startup_name: 'StyleLoop',
    industry: 'Fashion Tech',
    sector_type: 'B2C',
    country: 'Sweden',
    website_url: 'https://styleloop.example.com',
    stage: 'seed',
    short_description: 'AI-curated circular fashion marketplace',
    long_description: 'StyleLoop is a circular fashion marketplace that uses AI to match pre-owned luxury and designer items with buyers based on style preferences, body measurements, and sustainability goals. Our authentication system combines computer vision and expert verification to guarantee authenticity. With 30K monthly active users and €2.8M GMV, StyleLoop is leading the Scandinavian resale fashion market.',
    highlights: [
      '€2.8M GMV in trailing 12 months',
      '30K monthly active users with 70% repeat purchase rate',
      'AI authentication with 99.2% accuracy',
      'Carbon savings dashboard showing environmental impact per purchase',
      'Featured in Vogue Scandinavia as "startup to watch"',
    ],
    risks: [
      'Marketplace liquidity requires balanced supply and demand',
      'Authentication costs for luxury items are significant',
      'Competition from Vestiaire Collective and Vinted',
      'Fashion trends can shift consumer preferences rapidly',
    ],
    valuation_pre_money: 8_000_000,
    offer_target_eur: 800_000,
    offer_equity_percent: 10,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'filled',
    logo_url: undefined,
    founders: [
      { name: 'Astrid Lindqvist', role: 'CEO', linkedin_url: 'https://linkedin.com/in/astridlindqvist', education: 'Stockholm School of Economics (MSc, Business & Management)', background: 'Ex-H&M Group sustainability strategy; 6 years in fashion retail' },
      { name: 'Erik Johansson', role: 'CTO', linkedin_url: 'https://linkedin.com/in/erikjohansson', education: 'KTH Royal Institute of Technology (MSc, Machine Learning)', background: 'Ex-Spotify ML engineer; built recommendation systems at scale' },
    ],
    accelerator: '500 Global Batch 34',
    last_valuation_date: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Seed round at €8M pre-money; circular economy premium with strong GMV trajectory',
    company_updates: [
      { date: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(), headline: 'StyleLoop vault fully subscribed in 36 hours', summary: '€800K raised from 180+ investors; fastest close on VaultCapital' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '4.5x' },
      { label: 'Preferred window', value: '30 to 60 months' },
      { label: 'Trigger', value: 'GMV exceeds €15M annually' },
      { label: 'Trigger', value: 'Expansion to 5+ EU markets' },
      { label: 'Trigger', value: 'Series A at 4x valuation uplift' },
    ],
  },
  {
    id: 'deal-12',
    startup_name: 'UrbanNest',
    industry: 'PropTech',
    sector_type: 'B2B2C',
    country: 'Austria',
    website_url: 'https://urbannest.example.com',
    stage: 'pre-seed',
    short_description: 'Smart co-living platform for young professionals',
    long_description: 'UrbanNest partners with property owners to convert underutilised commercial spaces into tech-enabled co-living units for young professionals. Our platform handles everything from tenant matching and smart access to community events and utilities management. Launched in Vienna with 3 properties and 85% occupancy, UrbanNest aimed to expand across Austria and Germany but struggled to secure property partnerships at scale.',
    highlights: [
      '3 co-living properties operational in Vienna',
      '85% average occupancy rate',
      'IoT-enabled smart living with app-based controls',
      'Partnership with Wien Holding for urban regeneration',
      'Strong waiting list of 500+ potential tenants',
    ],
    risks: [
      'Capital-intensive property conversion model',
      'Regulatory complexity in tenant protection laws',
      'Dependent on property owner partnerships',
      'Economic downturn could reduce demand for premium co-living',
    ],
    valuation_pre_money: 2_000_000,
    offer_target_eur: 350_000,
    offer_equity_percent: 15,
    min_ticket_eur: 100,
    docs: { pitch_deck_url: '#pitch-deck', data_room_url: '#data-room' },
    status: 'failed',
    logo_url: undefined,
    founders: [
      { name: 'Felix Bauer', role: 'CEO', linkedin_url: 'https://linkedin.com/in/felixbauer', education: 'WU Vienna (MSc, Real Estate Management)', background: 'Former property developer; managed €50M+ residential portfolio' },
      { name: 'Nina Hofer', role: 'COO', linkedin_url: 'https://linkedin.com/in/ninahofer', education: 'TU Wien (MSc, Architecture)', background: 'Award-winning architect; specialised in adaptive reuse projects' },
    ],
    accelerator: undefined,
    last_valuation_date: undefined,
    last_valuation_note: undefined,
    company_updates: [
      { date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), headline: 'UrbanNest vault fails to reach funding target', summary: 'Raised only 42% of target; funds returned to investors' },
    ],
    exit_objectives: [
      { label: 'Target return', value: '3.0x' },
      { label: 'Preferred window', value: '48 to 72 months' },
      { label: 'Trigger', value: '20+ properties under management' },
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
