'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Quote, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { brand } from '../../data/site';
import { Breadcrumbs, Button, FieldError, inputClass, Label, PageHero, SectionHeading } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { cn } from '../../lib/utils';
import { submitLead, getTestimonials } from '../../lib/api';

export default function TestimonialsPage() {
  const [form, setForm] = useState({ name: '', contact: '', story: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [openId, setOpenId] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = pageTitle('Testimonials');
    getTestimonials().then((apiTestimonials) => {
      if (apiTestimonials && Array.isArray(apiTestimonials) && apiTestimonials.length > 0) {
        const mapped = apiTestimonials.map((t: any, idx: number) => ({
          id: t._id || `t-${idx}`,
          name: t.patientName || 'Ayurvedic Patient',
          context: t.treatmentReceived || 'Panchakarma Care',
          location: t.patientLocation || 'Trivandrum',
          category: t.rating ? `Rating: ${t.rating}/5` : 'Verified Care',
          quote: t.reviewText || 'Excellent treatment experience at Susrutha Hospital.',
          full: t.reviewText || 'Excellent treatment experience at Susrutha Hospital.',
        }));
        setStories(mapped);
      }
    });
  }, []);

  const storyCategories = useMemo(
    () => ['All', ...Array.from(new Set(stories.map((s) => s.category)))],
    [stories],
  );

  const filtered = useMemo(
    () => (filter === 'All' ? stories : stories.filter((s) => s.category === filter)),
    [filter, stories],
  );
  const active = stories.find((s) => s.id === openId) || null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Name required';
    if (!form.contact.trim()) err.contact = 'Contact required';
    if (form.story.trim().length < 20) err.story = 'Please share a bit more detail.';
    if (!form.consent) err.consent = 'Consent is required for moderation.';
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await submitLead({
        name: form.name,
        phone: form.contact,
        subject: 'Patient Story Submission',
        message: form.story,
      });
    } catch {
      try {
        const prev = JSON.parse(localStorage.getItem('susrutha_stories') || '[]');
        prev.push({ ...form, at: new Date().toISOString(), status: 'pending-moderation' });
        localStorage.setItem('susrutha_stories', JSON.stringify(prev));
      } catch {}
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Stories"
        title="Patient voices — archive & filters"
        description="Complete illustrative archive with treatment-category filters. Stories publish publicly only after verified consent."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Testimonials' }]} />

        <div className="flex flex-wrap gap-2 mb-8">
          {storyCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                filter === c ? 'bg-sus-green text-sus-cream' : 'bg-white border border-sus-green/10 text-sus-green-deep',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOpenId(t.id)}
                className="rounded-2xl border border-white/40 bg-white/60 p-6 text-left shadow-sm backdrop-blur-md hover:bg-white/80 transition-colors"
              >
                <Quote className="h-6 w-6 text-sus-gold" />
                <blockquote className="mt-4 text-sus-ink leading-relaxed line-clamp-5">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-sus-muted">
                  {t.name} · {t.context}
                </figcaption>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-sus-gold">{t.category}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Testimonials Found</h2>
            <p className="mt-2 text-sm text-sus-muted">No patient testimonials are currently published in this category in the database.</p>
          </div>
        )}

        <div className="mt-6">
          <a href={brand.contact.googleReview} target="_blank" rel="noreferrer" className="text-sus-green font-medium hover:underline">
            Leave a Google review
          </a>
        </div>

        <section className="mt-16 max-w-2xl">
          <SectionHeading title="Submit a story for moderation" description="Stories publish only after consent verification. Nothing goes live automatically." />
          {sent ? (
            <p className="mt-6 rounded-2xl border border-sus-green/10 bg-white p-6 text-sus-muted">Thank you. Your story is queued for moderation and consent checks.</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-sus-green/10 bg-white p-6 space-y-4" noValidate>
              <div>
                <Label htmlFor="tname">Name</Label>
                <input id="tname" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <FieldError message={errors.name} />
              </div>
              <div>
                <Label htmlFor="tcontact">Phone or email</Label>
                <input id="tcontact" className={inputClass} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                <FieldError message={errors.contact} />
              </div>
              <div>
                <Label htmlFor="tstory">Your experience</Label>
                <textarea id="tstory" rows={5} className={inputClass} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
                <FieldError message={errors.story} />
              </div>
              <label className="flex items-start gap-2 text-sm text-sus-muted">
                <input type="checkbox" className="mt-1" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
                I consent to Susrutha contacting me to verify and, if approved, publish this story (with agreed attribution).
              </label>
              <FieldError message={errors.consent} />
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit for moderation'}
              </Button>
            </form>
          )}
        </section>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-sus-green-deep/55 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenId(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={reduce ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? undefined : { y: 12, opacity: 0 }}
              className="relative max-w-lg w-full rounded-3xl bg-sus-cream p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="absolute right-4 top-4 h-9 w-9 rounded-full bg-white border border-sus-green/10 inline-flex items-center justify-center" onClick={() => setOpenId(null)} aria-label="Close">
                <X className="h-4 w-4" />
              </button>
              <p className="text-lg text-sus-ink leading-relaxed">“{active.full}”</p>
              <p className="mt-6 font-medium text-sus-green-deep">{active.name}</p>
              <p className="text-sm text-sus-muted">{active.context} · {active.location}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
