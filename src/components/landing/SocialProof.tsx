import { Lock, Shield, Euro } from 'lucide-react';

const stats = [
  { value: '€2.4M+', label: 'Capital deployed' },
  { value: '340+', label: 'Verified investors' },
  { value: '18', label: 'Vaults launched' },
  { value: '4.2x', label: 'Avg return multiple' },
];

const badges = [
  { icon: Lock, label: 'ECSPR Compliant' },
  { icon: Shield, label: 'SPV Isolated' },
  { icon: Euro, label: 'Investor Caps Enforced' },
];

const quotes = [
  {
    quote: "Vault Capital gave me access to deals I'd never find on my own.",
    name: 'Marco B.',
    city: 'Milan',
  },
  {
    quote: 'The SPV structure and fee transparency made this an easy decision.',
    name: 'Lena K.',
    city: 'Berlin',
  },
];

const SocialProof = () => {
  return (
    <section className="bg-slate-900 py-12 text-slate-100 md:py-20">
      <div className="container">
        <h2 className="mb-10 text-center text-3xl font-bold md:mb-14">
          Built for serious investors
        </h2>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:mb-14 md:grid-cols-4 md:gap-6">
          {stats.map(s => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 text-center md:p-6"
            >
              <p className="text-2xl font-bold text-white md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400 md:text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 md:mb-14 md:gap-4">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/60 px-4 py-2 text-sm text-slate-200"
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </div>
          ))}
        </div>

        {/* Quotes */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {quotes.map(q => (
            <div
              key={q.name}
              className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-6"
            >
              <p className="text-base text-slate-100 md:text-lg">"{q.quote}"</p>
              <p className="mt-3 text-sm text-slate-400">
                {q.name}, {q.city}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
