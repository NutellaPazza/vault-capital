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
    docs: {
      pitch_deck_url: '#pitch-deck',
      data_room_url: '#data-room',
    },
    status: 'live',
    logo_url: undefined,
    founders: [
      {
        name: 'Marco Rossi',
        role: 'CEO',
        linkedin_url: 'https://linkedin.com/in/marcorossi',
        education: 'Politecnico di Milano (MSc, Computer Engineering)',
        background: 'Ex-Google PM; scaled B2B SaaS teams across EU',
      },
      {
        name: 'Elena Bianchi',
        role: 'CTO',
        linkedin_url: 'https://linkedin.com/in/elenabianchi',
        education: 'University of Bologna (MSc, AI & Machine Learning)',
        background: 'Ex-Salesforce engineer; led platform reliability & ML pipelines',
      },
    ],
    accelerator: 'Techstars Milan 2023',
    last_valuation_date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Pre-money valuation set at €10M based on 5x ARR multiple',
    company_updates: [
      {
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        headline: 'TechFlow partners with SAP for integration',
        summary: 'New partnership expands enterprise reach across DACH region',
      },
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
    docs: {
      pitch_deck_url: '#pitch-deck',
      data_room_url: '#data-room',
    },
    status: 'upcoming',
    logo_url: undefined,
    founders: [
      {
        name: 'Dr. Hans Mueller',
        role: 'CEO',
        linkedin_url: 'https://linkedin.com/in/hansmueller',
        education: 'PhD, Computer Vision (TU Munich)',
        background: 'Former head of ML at an automotive Tier-1 supplier',
      },
      {
        name: 'Dr. Anna Schmidt',
        role: 'Chief Scientist',
        linkedin_url: 'https://linkedin.com/in/annaschmidt',
        education: 'PhD, Applied AI (Max Planck Institute)',
        background: 'Published 30+ papers on industrial CV and anomaly detection',
      },
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
    docs: {
      pitch_deck_url: '#pitch-deck',
      data_room_url: '#data-room',
    },
    status: 'closed',
    logo_url: undefined,
    founders: [
      {
        name: 'Sophie van der Berg',
        role: 'CEO',
        linkedin_url: 'https://linkedin.com/in/sophievdberg',
        education: 'Erasmus University Rotterdam (MSc, Business & Sustainability)',
        background: 'Built EU supply-chain partnerships; ex-Unilever sustainability team',
      },
      {
        name: 'Jan de Vries',
        role: 'COO',
        linkedin_url: 'https://linkedin.com/in/jandevries',
        education: 'TU Delft (MSc, Industrial Engineering)',
        background: 'Ops leader in marketplaces; scaled logistics across Benelux',
      },
      {
        name: 'Lisa Jansen',
        role: 'CMO',
        linkedin_url: 'https://linkedin.com/in/lisajansen',
        education: 'University of Amsterdam (MSc, Marketing)',
        background: 'Growth marketing in DTC; led acquisition at 2 European e-com brands',
      },
    ],
    accelerator: 'Y Combinator W23',
    last_valuation_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_valuation_note: 'Valuation increased 25% following Series A interest at €15M',
    company_updates: [
      {
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        headline: 'GreenCommerce raises Series A interest at €15M valuation',
        summary: 'Multiple VCs expressing interest, valuation up 25% from seed round',
      },
      {
        date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        headline: 'Marketplace hits 50K monthly active buyers',
        summary: 'Growth accelerates as more consumers prioritize sustainable shopping',
      },
    ],
    exit_objectives: [
      { label: 'Target return', value: '5.0x' },
      { label: 'Preferred window', value: '36 to 60 months' },
      { label: 'Trigger', value: 'Regulated status obtained in 2+ EU markets' },
      { label: 'Trigger', value: 'Acquisition offer from established financial institution' },
    ],
  },
];

// Calculate pool end times dynamically
const pool1End = new Date(now.getTime() + 38 * 60 * 60 * 1000); // 38 hours from now
const pool2Start = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
const pool2End = new Date(pool2Start.getTime() + 72 * 60 * 60 * 1000); // 72 hours after start

export const initialPools: Pool[] = [
  {
    id: 'pool-1',
    deal_id: 'deal-1',
    target_eur: 1_000_000,
    raised_eur: 620_000,
    start_datetime: new Date(now.getTime() - 34 * 60 * 60 * 1000).toISOString(), // Started 34h ago
    end_datetime: pool1End.toISOString(),
    investors_count: 127,
    fee_entry_percent: 2.0,
    fee_carry_percent: 2.0,
    pool_status: 'live',
  },
  {
    id: 'pool-2',
    deal_id: 'deal-2',
    target_eur: 500_000,
    raised_eur: 0,
    start_datetime: pool2Start.toISOString(),
    end_datetime: pool2End.toISOString(),
    investors_count: 0,
    fee_entry_percent: 2.0,
    fee_carry_percent: 2.0,
    pool_status: 'upcoming',
  },
  {
    id: 'pool-3',
    deal_id: 'deal-3',
    target_eur: 750_000,
    raised_eur: 750_000,
    start_datetime: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    end_datetime: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(), // Ended 27 days ago
    investors_count: 245,
    fee_entry_percent: 2.0,
    fee_carry_percent: 2.0,
    pool_status: 'active',
  },
];

// Demo user
export const initialUser: User = {
  id: 'user-1',
  name: 'Alex Demo',
  email: 'alex@demo.com',
  risk_profile: 'balanced',
  kyc_status: 'verified',
  wallet_balance_eur: 25_000,
  created_at: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
  notification_preferences: {
    new_pools: true,
    portfolio_updates: true,
    marketplace_activity: true,
  },
  pool_interests: {
    industries: ['Enterprise Software', 'Artificial Intelligence'],
    stages: ['seed', 'pre-seed'],
  },
};

// Mock seller user for marketplace
export const mockSellerUser: User = {
  id: 'user-2',
  name: 'Maria Investor',
  email: 'maria@demo.com',
  risk_profile: 'aggressive',
  kyc_status: 'verified',
  wallet_balance_eur: 15_000,
  created_at: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  notification_preferences: {
    new_pools: true,
    portfolio_updates: true,
    marketplace_activity: true,
  },
  pool_interests: {
    industries: ['Sustainable E-commerce'],
    stages: ['seed'],
  },
};

// Demo positions
export const initialPositions: Position[] = [
  {
    id: 'pos-1',
    user_id: 'user-1',
    pool_id: 'pool-3',
    invested_eur: 10_000,
    ownership_percent_of_spv: (10_000 / 750_000) * 10, // ~1.33%
    current_estimated_value_eur: 12_500, // 25% increase mock
    lockup: false,
    is_listed_on_market: false,
    created_at: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pos-2',
    user_id: 'user-2',
    pool_id: 'pool-3',
    invested_eur: 15_000,
    ownership_percent_of_spv: (15_000 / 750_000) * 10, // 2%
    current_estimated_value_eur: 18_750, // 25% increase mock
    lockup: false,
    is_listed_on_market: true,
    created_at: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo marketplace listing
export const initialListings: MarketplaceListing[] = [
  {
    id: 'listing-1',
    seller_user_id: 'user-2',
    pool_id: 'pool-3',
    position_id: 'pos-2',
    percent_of_position_for_sale: 50,
    ask_price_eur: 10_000,
    created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'active',
    fee_marketplace_percent: 1.0,
  },
];

// Demo transactions
export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    user_id: 'user-1',
    type: 'deposit',
    amount_eur: 35_000,
    timestamp: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { notes: 'Initial deposit' },
  },
  {
    id: 'tx-2',
    user_id: 'user-1',
    type: 'invest',
    amount_eur: -10_000,
    timestamp: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { pool_id: 'pool-3', notes: 'Investment in GreenCommerce' },
  },
  {
    id: 'tx-3',
    user_id: 'user-1',
    type: 'fee',
    amount_eur: -200,
    timestamp: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { pool_id: 'pool-3', notes: '2% entry fee' },
  },
];

// Demo notifications
export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-1',
    title: 'New Pool Live!',
    message: 'TechFlow SaaS pool is now live. 72 hours to invest.',
    read: false,
    created_at: new Date(now.getTime() - 34 * 60 * 60 * 1000).toISOString(),
    type: 'pool',
  },
  {
    id: 'notif-2',
    user_id: 'user-1',
    title: 'Portfolio Update',
    message: 'GreenCommerce valuation increased by 25%',
    read: true,
    created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'portfolio',
  },
  {
    id: 'notif-3',
    user_id: 'user-1',
    title: 'Marketplace Activity',
    message: 'New listing available for GreenCommerce shares',
    read: false,
    created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'marketplace',
  },
];

// Demo offers
export const initialOffers: MarketplaceOffer[] = [];