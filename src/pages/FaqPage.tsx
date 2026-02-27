import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Getting Started',
    faqs: [
      {
        q: 'What is VaultCapital?',
        a: 'VaultCapital is a platform that allows retail investors to access private startup deals through pooled investments. We negotiate exclusive terms with vetted startups, open time-limited investment pools, and manage the entire process through a professional SPV (Special Purpose Vehicle) structure. Our mission is to make startup investing accessible from just €100.',
      },
      {
        q: 'How do I get started?',
        a: 'Create a free account, complete the KYC verification process, and deposit funds into your wallet. Once verified, you can browse available pools and invest when a pool goes live. The entire process takes about 10 minutes to set up.',
      },
      {
        q: 'What is the minimum investment?',
        a: 'The minimum investment is €100 per pool. This allows you to diversify across multiple deals without committing large amounts to any single startup. There is no maximum investment limit, though pools have a total raise target.',
      },
      {
        q: 'Do I need to be an accredited investor?',
        a: 'VaultCapital is designed to be accessible to retail investors. You need to complete KYC verification and acknowledge the risks of startup investing. Specific eligibility requirements may vary depending on your country of residence.',
      },
    ],
  },
  {
    title: 'Investment Process',
    faqs: [
      {
        q: 'How does pooled investment work?',
        a: 'Instead of investing individually (which often requires €50K+ minimums), VaultCapital pools funds from many investors into a single SPV (Special Purpose Vehicle). This SPV then invests in the startup on behalf of all participants, allowing you to participate from just €100. Each investor owns a proportional share of the SPV based on their contribution.',
      },
      {
        q: 'How long are pools open?',
        a: 'Investment pools are open for exactly 72 hours. This creates urgency and ensures deals close quickly, which is attractive to the startups we work with. You\'ll receive a notification when a pool you\'re interested in goes live.',
      },
      {
        q: 'What happens if the pool doesn\'t reach its target?',
        a: 'If a pool doesn\'t reach its minimum funding target within the 72-hour window, the pool fails and all committed capital is automatically refunded to investors\' wallets in full. No fees are charged on failed pools.',
      },
      {
        q: 'How are startups selected?',
        a: 'Our deal team conducts thorough due diligence on every startup. We evaluate the founding team, market opportunity, traction and metrics, financial projections, legal structure, and competitive landscape. Only startups that pass our rigorous screening are presented to investors.',
      },
    ],
  },
  {
    title: 'Legal & Structure',
    faqs: [
      {
        q: 'How does the SPV structure work?',
        a: 'The SPV (Special Purpose Vehicle) is a separate legal entity created for each deal. All investor capital is pooled into the SPV, which then makes the investment in the startup. VaultCapital acts as the nominee and manager of the SPV, exercising governance and voting rights on behalf of all investors. You hold economic rights proportional to your investment.',
      },
      {
        q: 'Do I have voting rights in the startup?',
        a: 'No. Governance and voting rights are exercised by VaultCapital as SPV manager on behalf of all pool participants. This is necessary to maintain a clean cap table for the startup and ensure efficient decision-making. You hold economic rights only — meaning you benefit from capital appreciation, dividends, and exit proceeds proportional to your investment.',
      },
      {
        q: 'Who makes decisions about the investment?',
        a: 'VaultCapital\'s investment committee makes all major decisions regarding the SPV\'s investment, including whether to accept acquisition offers, participate in follow-on funding rounds, or exit. All decisions are made with the goal of maximizing returns for investors. VaultCapital does not invest its own capital alongside pool investors to avoid conflicts of interest.',
      },
      {
        q: 'What happens to my investment if VaultCapital shuts down?',
        a: 'Each SPV is a legally independent entity, separate from VaultCapital\'s operations. If VaultCapital ceases operations, the SPVs and their underlying investments continue to exist. A succession plan and appointed administrators would manage the SPVs and protect investor interests.',
      },
    ],
  },
  {
    title: 'Fees & Costs',
    faqs: [
      {
        q: 'What fees does VaultCapital charge?',
        a: 'We charge three types of fees: (1) A 2% entry fee at the time of investment, which covers deal sourcing, due diligence, and SPV formation costs. (2) A 2% carry fee on profits at exit — if there\'s no profit, there\'s no carry. (3) A 1% Resale Board fee on resale trades, paid by the buyer. There are no annual management fees, account maintenance fees, or withdrawal fees.',
      },
      {
        q: 'How is the entry fee calculated?',
        a: 'The 2% entry fee is deducted from your invested amount at the time of investment. For example, if you invest €1,000, €980 goes into the pool and €20 is the entry fee. This fee covers the costs of deal sourcing, legal due diligence, SPV formation, and ongoing administration.',
      },
      {
        q: 'How does the carry fee work?',
        a: 'The 2% carry fee is applied only on profits at exit. It\'s calculated on the difference between your exit proceeds and your original investment. For example: if you invested €1,000 and the exit returns €5,000, your profit is €4,000, and the carry fee is €80 (2% of €4,000). If the exit returns €1,000 or less (no profit), no carry fee is charged.',
      },
    ],
  },
  {
    title: 'Resale Board & Liquidity',
    faqs: [
      {
        q: 'Can I sell my position before the startup exits?',
        a: 'Yes. Once a vault moves to "active" status (after the investment settles), you can list your position on our Resale Board. Other investors can buy it at the price you set, or make counter-offers. This provides liquidity that traditional startup investments don\'t offer.',
      },
      {
        q: 'How does the Resale Board work?',
        a: 'Sellers list their positions (fully or partially) at a desired price. Buyers can purchase at the asking price or submit a counter-offer. Once a transaction is agreed upon, the position is transferred to the buyer and the seller receives the funds in their wallet. A 1% fee is paid by the buyer.',
      },
      {
        q: 'Is selling on the Resale Board guaranteed?',
        a: 'No. The Resale Board depends on supply and demand. There\'s no guarantee that buyers will be interested in your position at your desired price. You may need to adjust your price or wait for a buyer. The Resale Board provides the opportunity for liquidity, but doesn\'t guarantee it.',
      },
    ],
  },
  {
    title: 'Returns & Exits',
    faqs: [
      {
        q: 'How are exits handled?',
        a: 'When a startup has an exit event (acquisition, IPO, or secondary sale), VaultCapital manages the process. The investment committee evaluates the offer and decides whether to accept. Proceeds are distributed pro-rata to all investors in the SPV, minus the carry fee on any profits. Net proceeds are credited to your VaultCapital wallet.',
      },
      {
        q: 'How are dividends distributed?',
        a: 'If a startup pays dividends, they are received by the SPV and distributed pro-rata to all investors based on their ownership percentage. Distributions are credited directly to your wallet. Note: most early-stage startups don\'t pay dividends — returns typically come from exit events.',
      },
      {
        q: 'What are the risks?',
        a: 'Startup investing is inherently high-risk. The majority of startups fail, and you may lose your entire invested capital. Returns are not guaranteed, investments can be illiquid for years, and valuations can fluctuate significantly. Only invest money you can afford to lose entirely. VaultCapital does not provide financial advice and this is not a recommendation to invest.',
      },
      {
        q: 'What are my tax obligations?',
        a: 'Tax implications of startup investments (including capital gains, dividends, and losses) are the investor\'s responsibility and depend on your country of residence. VaultCapital provides annual statements and transaction history to help with tax reporting. We recommend consulting a tax advisor.',
      },
    ],
  },
];

const FaqPage = () => (
  <div className="container py-8">
    <Button variant="ghost" size="sm" className="mb-6" asChild>
      <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Home</Link>
    </Button>

    <div className="mb-12 text-center">
      <div className="mb-4 flex items-center justify-center gap-2">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
      </div>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Everything you need to know about investing with VaultCapital. Can't find your answer? Contact us.
      </p>
    </div>

    <div className="mx-auto max-w-3xl space-y-10">
      {faqCategories.map((category) => (
        <section key={category.title}>
          <h2 className="mb-4 text-2xl font-bold">{category.title}</h2>
          <Accordion type="single" collapsible className="w-full">
            {category.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`${category.title}-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>

    {/* CTA */}
    <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-muted/50 p-8 text-center">
      <h2 className="mb-2 text-xl font-bold">Still have questions?</h2>
      <p className="mb-6 text-muted-foreground">Read more about our legal structure and process, or get started with a free account.</p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" asChild>
          <Link to="/how-it-works">How It Works</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Create Account</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default FaqPage;
