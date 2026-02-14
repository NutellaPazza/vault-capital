import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'What is VaultCapital?',
    a: 'VaultCapital is a platform that allows retail investors to access private startup deals through pooled investments. We negotiate exclusive terms with vetted startups, open time-limited investment pools, and manage the entire process through a professional SPV structure.',
  },
  {
    q: 'How does pooled investment work?',
    a: 'Instead of investing individually (which often requires €50K+ minimums), VaultCapital pools funds from many investors into a single SPV (Special Purpose Vehicle). This SPV then invests in the startup on behalf of all participants, allowing you to participate from just €100.',
  },
  {
    q: 'What are the risks of investing in startups?',
    a: 'Startup investing is inherently high-risk. The majority of startups fail, and you may lose your entire invested capital. Returns are not guaranteed, and investments are illiquid — meaning you may not be able to sell your position easily. Only invest money you can afford to lose entirely.',
  },
  {
    q: 'How does the SPV structure protect me?',
    a: 'The SPV (Special Purpose Vehicle) is a separate legal entity that holds the investment. VaultCapital acts as nominee/manager, handling governance and voting rights. You hold economic rights proportional to your investment, and exit proceeds are distributed pro-rata.',
  },
  {
    q: 'Can I sell my position before the startup exits?',
    a: 'Yes. Once a pool moves to "active" status, you can list your position on our secondary marketplace. Other investors can buy it at a price you set, or make offers. A 1% marketplace fee applies to the buyer.',
  },
  {
    q: 'What fees does VaultCapital charge?',
    a: 'We charge a 2% entry fee at the time of investment, a 2% carry fee on profits at exit (no profit = no carry), and a 1% marketplace fee on secondary trades (paid by the buyer). There are no annual management fees.',
  },
  {
    q: 'How are exits handled?',
    a: 'When a startup has an exit event (acquisition, IPO, or secondary sale), VaultCapital manages the process. Proceeds are distributed pro-rata to all investors in the SPV, minus the carry fee on any profits. Exit timing is decided by VaultCapital based on the best outcome for investors.',
  },
  {
    q: 'What is the minimum investment?',
    a: 'The minimum investment is €100 per pool. This allows you to diversify across multiple deals without committing large amounts to any single startup.',
  },
  {
    q: 'How do I get started?',
    a: 'Create a free account, deposit funds into your wallet, and browse available pools. When a pool is live, you have 72 hours to invest. After the pool closes and settles, your position appears in your portfolio.',
  },
  {
    q: 'Do I have voting rights in the startup?',
    a: 'No. Governance and voting rights are exercised by VaultCapital as SPV manager on behalf of all pool participants. You hold economic rights only — meaning you benefit from dividends and exit proceeds proportional to your investment.',
  },
];

const FaqSection = () => (
  <section className="container py-16">
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FaqSection;
