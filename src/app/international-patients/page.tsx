'use client';

import { FormEvent, useEffect, useState } from 'react';
import { brand, ayurVillage } from '../../data/site';
import { packages } from '../../data/packages';
import {
  AiSummary,
  Breadcrumbs,
  Button,
  CardLink,
  FaqList,
  FieldError,
  inputClass,
  Label,
  SectionHeading,
} from '../../components/ui';
import { pageTitle, faqSchema } from '../../lib/seo';
import { Plane, FileText, Languages, Home, Package, MapPinned, Shield } from 'lucide-react';
import { submitLead } from '../../lib/api';

export default function InternationalPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    dates: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = pageTitle('International Patients — Kerala Medical Travel');
    const faqs = [
      {
        q: 'How early should international guests enquire?',
        a: 'As early as practical, especially in peak seasons. Clinical suitability, room category and travel buffers need confirmation before final flights.',
      },
      {
        q: 'Do you provide visa invitation letters?',
        a: 'Visa support is confirmed case by case during enquiry after a suitable care window is identified. Requirements vary by nationality.',
      },
      {
        q: 'Is interpreter support available?',
        a: 'Language support is arranged according to availability when requested in advance. English is commonly used in clinical coordination; other languages are confirmed during planning.',
      },
      {
        q: 'How far is Ayur Village from the airport?',
        a: `${ayurVillage.name} is about 20 km from Trivandrum International Airport — useful for arrival rest and privacy-focused programmes.`,
      },
    ];
    document.getElementById('schema-intl-faq')?.remove();
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = 'schema-intl-faq';
    el.text = JSON.stringify(faqSchema(faqs));
    document.head.appendChild(el);
  }, []);

  const featured = packages.filter((p) => ['rejuvenation', '7-day', '16-day', '5-day'].includes(p.id));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Name required';
    if (!form.email.trim()) err.email = 'Email required for international coordination';
    if (!form.country.trim()) err.country = 'Country required';
    if (!form.message.trim()) err.message = 'Please share your goals or questions';
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await submitLead({
        name: form.name,
        email: form.email,
        phone: form.phone || 'N/A',
        subject: `International Patient Enquiry - ${form.country}`,
        message: `Country: ${form.country}, Dates: ${form.dates}. Message: ${form.message}`,
      });
    } catch {
      try {
        const prev = JSON.parse(localStorage.getItem('susrutha_intl') || '[]');
        prev.push({ ...form, at: new Date().toISOString() });
        localStorage.setItem('susrutha_intl', JSON.stringify(prev));
      } catch {}
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <div className="bg-[#120A0B] text-ivory-50 font-body min-h-screen">
      <section className="relative min-h-[70vh] overflow-hidden bg-[#1E1B1B] text-ivory-50">
        <img
          src="/images/kerala-nature.jpg"
          alt="Serene Kerala landscape for international medical travellers"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B1B] via-[#1E1B1B]/85 to-[#1E1B1B]/40" />
        <div className="container-wide section-pad relative flex min-h-[70vh] flex-col justify-center py-20">
          <p className="text-xs uppercase tracking-[0.28em] font-bold text-ochre">International Patient Concierge · Kerala</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl sm:text-5xl lg:text-6xl text-balance leading-[1.05] font-bold text-ivory-50">
            Luxury of Clarity. Authenticity of Institutional Hospital Care.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory-200/90 leading-relaxed font-light">
            Plan medical travel to Thiruvananthapuram with airport-aware logistics, Ayur Village privacy, physician-directed packages and honest expectations — not brochure theatre.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="#intl-enquiry" variant="primary">
              Start International Travel Enquiry
            </Button>
            <Button to="/packages" variant="glass">
              Explore Care Packages
            </Button>
          </div>
        </div>
      </section>

      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'International Patients' }]} />

        <AiSummary text="Susrutha Ayurveda welcomes international patients for authentic Kerala Panchakarma and specialty programmes at its Kattakada hospital, with Ayur Village stays about 20 km from Trivandrum International Airport and case-by-case visa and interpreter coordination." />

        <section className="mt-16 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <SectionHeading eyebrow="Why Kerala" title="A Living Sanctuary of Classical Medical Care" />
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">
              Kerala remains a global reference for Panchakarma because the tradition is still practised as medicine, not only hospitality. Climate, diet culture and trained therapy ecosystems support multi-day supervised programmes.
            </p>
            <p className="mt-4 text-ivory-200/90 leading-relaxed text-base sm:text-lg">
              Susrutha adds hospital infrastructure: 40 beds, OT-backed specialty pathways, director-led clinics and an ecosystem spanning pharma, lab and nursing education.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-ochre/30 shadow-glass-dark">
            <img src="/images/ayur-village.jpg" alt="Ayur Village stay setting" className="h-full w-full object-cover aspect-[5/4]" />
          </div>
        </section>

        <section className="mt-16 font-body">
          <SectionHeading eyebrow="Medical travel guide" title="What we coordinate with you" align="center" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Plane, t: 'Airport assistance', d: 'Share flight details early so arrival-to-admission timing is realistic. Trivandrum International Airport is the primary gateway; Ayur Village is ~20 km away.' },
              { icon: FileText, t: 'Visa guidance', d: 'Invitation and documentation support is confirmed case by case after clinical fit and dates are clear. Always verify current consulate rules for your nationality.' },
              { icon: Languages, t: 'Interpreter support', d: 'Request language needs in advance. English is commonly used in coordination; additional interpreter arrangements depend on availability.' },
              { icon: Home, t: 'Ayur Village stay', d: `${ayurVillage.cottages} traditional cottages with private treatment rooms — ideal for rejuvenation, couples and privacy-focused recovery.` },
              { icon: Package, t: 'Package planning', d: 'From 5–7 day programmes to extended 16-day care. Therapy mix is physician-directed after assessment — not a fixed tourist checklist.' },
              { icon: Shield, t: 'Clinical honesty', d: 'Educational care without cure promises. Red-flag symptoms may require conventional pathways first. That restraint is part of trust.' },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-6 shadow-glass-dark text-ivory-50">
                <item.icon className="h-5 w-5 text-[#FFC86B]" />
                <h3 className="mt-3 font-display text-xl text-white font-bold">{item.t}</h3>
                <p className="mt-2 text-sm text-ivory-200/90 leading-relaxed font-body">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] bg-[#1C1214] border border-ochre/40 text-ivory-50 overflow-hidden grid lg:grid-cols-2 shadow-glass-dark font-body">
          <div className="p-8 sm:p-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#FFC86B] font-bold">Stay</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">{ayurVillage.name}</h2>
            <p className="mt-4 text-ivory-200/90 leading-relaxed">{ayurVillage.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-ivory-300/80">
              {ayurVillage.features.map((f) => (
                <li key={f} className="flex gap-2"><MapPinned className="h-4 w-4 text-[#FFC86B] shrink-0 mt-0.5" />{f}</li>
              ))}
            </ul>
            <Button to="/ayur-village" variant="secondary" className="mt-8">
              Explore Ayur Village
            </Button>
          </div>
          <img src="/images/hospital-room.jpg" alt="Calm inpatient environment" className="h-full w-full object-cover min-h-[16rem]" />
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Packages" title="Programmes often chosen by travellers" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((p) => (
              <CardLink key={p.id} to={`/packages/${p.slug}`} title={p.name} description={p.summary} meta={p.durationLabel} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Gallery" title="Sense of place" />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {['/images/kerala-nature.jpg', '/images/ayur-village.jpg', '/images/panchakarma.jpg', '/images/hero-ayurveda.jpg'].map((src) => (
              <img key={src} src={src} alt="" className="rounded-2xl aspect-[4/3] object-cover w-full border border-ochre/30 shadow-glass-dark" loading="lazy" />
            ))}
          </div>
        </section>

        <section className="mt-16 max-w-3xl">
          <SectionHeading title="FAQs for international guests" />
          <div className="mt-6">
            <FaqList
              items={[
                {
                  q: 'How early should international guests enquire?',
                  a: 'As early as practical, especially in peak seasons. Clinical suitability, room category and travel buffers need confirmation before final flights.',
                },
                {
                  q: 'Do you provide visa invitation letters?',
                  a: 'Visa support is confirmed case by case during enquiry after a suitable care window is identified. Requirements vary by nationality.',
                },
                {
                  q: 'Is interpreter support available?',
                  a: 'Language support is arranged according to availability when requested in advance. English is commonly used in clinical coordination; other languages are confirmed during planning.',
                },
                {
                  q: 'How far is Ayur Village from the airport?',
                  a: `${ayurVillage.name} is about 20 km from Trivandrum International Airport — useful for arrival rest and privacy-focused programmes.`,
                },
              ]}
            />
          </div>
        </section>

        <section id="intl-enquiry" className="mt-16 scroll-mt-28 grid gap-8 lg:grid-cols-2 font-body">
          <div className="rounded-[1.75rem] border border-ochre/30 bg-[#1C1214]/95 p-6 sm:p-8 shadow-glass-dark text-ivory-50">
            <h2 className="font-display text-3xl text-white font-bold">Travel enquiry</h2>
            <p className="mt-2 text-sm text-ivory-200/90">Share goals, medical background summary and preferred months. We respond with next clinical steps.</p>
            {sent ? (
              <p className="mt-6 text-sus-muted">Thank you, {form.name}. Our international coordination desk will respond to {form.email}.</p>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="iname">Full name</Label>
                    <input id="iname" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <FieldError message={errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="icountry">Country</Label>
                    <input id="icountry" className={inputClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                    <FieldError message={errors.country} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="iemail">Email</Label>
                    <input id="iemail" type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <FieldError message={errors.email} />
                  </div>
                  <div>
                    <Label htmlFor="iphone">Phone / WhatsApp</Label>
                    <input id="iphone" className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="idates">Preferred travel window</Label>
                  <input id="idates" className={inputClass} value={form.dates} onChange={(e) => setForm({ ...form, dates: e.target.value })} placeholder="Month / flexible dates" />
                </div>
                <div>
                  <Label htmlFor="imsg">Goals & questions</Label>
                  <textarea id="imsg" rows={5} className={inputClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  <FieldError message={errors.message} />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit international enquiry'}
                </Button>
              </form>
            )}
          </div>
          <div className="rounded-[1.75rem] bg-[#1C1214]/95 border border-ochre/30 p-6 sm:p-8 flex flex-col justify-between shadow-glass-dark text-ivory-50 font-body">
            <div>
              <h2 className="font-display text-3xl font-bold text-white">Contact CTA</h2>
              <p className="mt-3 text-ivory-200/90 leading-relaxed">Prefer a direct line while planning flights or caregiver logistics?</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <a className="text-[#FFC86B] font-medium hover:underline" href={`tel:${brand.contact.mobileTel}`}>
                    {brand.contact.mobile}
                  </a>
                </li>
                <li>
                  <a className="text-[#FFC86B] font-medium hover:underline" href={`mailto:${brand.contact.email}`}>
                    {brand.contact.email}
                  </a>
                </li>
                <li>
                  <a className="text-[#FFC86B] font-medium hover:underline" href={brand.contact.whatsapp} target="_blank" rel="noreferrer">
                    WhatsApp coordination →
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/book">Book consultation</Button>
              <Button to="/contact" variant="secondary">
                Contact desk
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
