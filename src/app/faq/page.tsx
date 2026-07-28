'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, Button, FaqList, PageHero } from '../../components/ui';
import { pageTitle, faqSchema } from '../../lib/seo';
import { getFaqs } from '../../lib/api';

export default function FaqPage() {
  const [faqList, setFaqList] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('FAQ');
    getFaqs().then((apiFaqs) => {
      if (apiFaqs && Array.isArray(apiFaqs) && apiFaqs.length > 0) {
        const mapped = apiFaqs.map((f: any) => ({
          q: f.question || f.q,
          a: f.answer || f.a,
        }));
        setFaqList(mapped);

        document.getElementById('schema-faq-global')?.remove();
        const el = document.createElement('script');
        el.type = 'application/ld+json';
        el.id = 'schema-faq-global';
        el.text = JSON.stringify(faqSchema(mapped));
        document.head.appendChild(el);
      }
    });
  }, []);

  return (
    <div>
      <PageHero eyebrow="FAQ" title="Practical questions, Ayurveda-specific answers" description="No dental-template leftovers — only questions patients actually ask about Susrutha." />
      <div className="container-wide section-pad py-12 max-w-3xl">
        <Breadcrumbs items={[{ label: 'FAQ' }]} />
        {faqList.length > 0 ? (
          <FaqList items={faqList} />
        ) : (
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No FAQs Published</h2>
            <p className="mt-2 text-sm text-sus-muted">No frequently asked questions are currently published in the database.</p>
          </div>
        )}
        <Button to="/contact" className="mt-8">Still need help?</Button>
      </div>
    </div>
  );
}

