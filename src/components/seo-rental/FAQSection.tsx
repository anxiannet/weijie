import type {FAQItem} from '@/lib/seo-rental-pages';

type FAQSectionProps = {
  faqs: FAQItem[];
};

export function FAQSection({faqs}: FAQSectionProps) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
      <h2 className="font-headline text-2xl font-bold text-foreground md:text-3xl">FAQ</h2>
      <div className="mt-6 divide-y">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
            <h3 className="text-base font-semibold leading-7 text-foreground">{faq.question}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
