'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getDoctorBySlug } from '../../../data/doctors';
import { specialties } from '../../../data/specialties';
import { treatments } from '../../../data/treatments';
import { articles } from '../../../data/content';
import { branches } from '../../../data/site';
import { AiSummary, Breadcrumbs, Button, ConfirmSlot, FaqList, PageHero } from '../../../components/ui';
import { pageTitle, physicianSchema, faqSchema } from '../../../lib/seo';
import { getDoctorBySlug as fetchDoctorApi } from '../../../lib/api';

export default function DoctorProfilePage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      fetchDoctorApi(slug).then((apiDoc) => {
        if (apiDoc) {
          setDoctor({
            id: apiDoc._id || apiDoc.slug,
            slug: apiDoc.slug,
            name: apiDoc.name,
            qual: apiDoc.qualifications || 'BAMS',
            role: apiDoc.designation || 'Senior Ayurvedic Physician',
            image: apiDoc.photo || '/images/doctor-portrait.jpg',
            availability: typeof apiDoc.availability === 'string' ? apiDoc.availability : 'Mon - Sat (OPD)',
            specializations: apiDoc.specialties || ['General Ayurveda'],
            pillars: apiDoc.specialties || [],
            lineage: 'Authentic Kerala Ayurveda Tradition',
            aiSummary: apiDoc.bio || 'Expert practitioner in classical Ayurveda treatment.',
            philosophy: 'Individualized holistic healing root-cause diagnostics.',
            approach: apiDoc.bio || 'Patient-centric consultation with custom Kerala panchakarma therapy protocols.',
            education: [apiDoc.qualifications || 'BAMS'],
            isDirector: !!apiDoc.isDirector,
            signatureTreatments: [],
            specialtyIds: [],
            confirmSlots: [],
            branchIds: apiDoc.assignedBranchIds?.map((b: any) => typeof b === 'object' ? b._id : b) || ['kat'],
          });
        } else {
          const fallback = getDoctorBySlug(slug);
          if (fallback) setDoctor(fallback);
        }
      });
    }
  }, [slug]);

  useEffect(() => {
    if (!doctor || typeof window === 'undefined') return;
    document.title = pageTitle(`${doctor.name} — ${doctor.qual}`);
    const scripts = [
      { id: 'schema-physician', data: physicianSchema(doctor) },
      {
        id: 'schema-faq-doc',
        data: faqSchema([
          {
            q: `How do I book ${doctor.name}?`,
            a: `Availability: ${doctor.availability}. Use the appointment form and select this doctor where listed. Bookings are confirmed against the roster before travel.`,
          },
          {
            q: `What does ${doctor.name} focus on?`,
            a: (doctor.specializations || []).join('; ') || (doctor.pillars || []).join('; '),
          },
        ]),
      },
    ];
    scripts.forEach(({ id, data }) => {
      document.getElementById(id)?.remove();
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = id;
      el.text = JSON.stringify(data);
      document.head.appendChild(el);
    });
  }, [doctor, slug]);

  if (!doctor) {
    return (
      <div className="container-wide section-pad py-20">
        <h1 className="font-display text-3xl">Doctor not found</h1>
        <Button to="/doctors" className="mt-6">Back to doctors</Button>
      </div>
    );
  }

  const specs = specialties.filter((s) => doctor.specialtyIds.includes(s.id));
  const txs = treatments.filter((t) => doctor.signatureTreatments.includes(t.id));
  const docsArticles = articles.filter((a) => a.authorId === doctor.id);
  const docsBranches = branches.filter((b) => doctor.branchIds.includes(b.id));

  return (
    <div>
      <PageHero eyebrow={doctor.isDirector ? 'Director profile' : 'Physician profile'} title={doctor.name} description={`${doctor.qual} · ${doctor.role}`}>
        <div className="flex flex-wrap gap-3">
          <Button to={`/book?doctor=${doctor.slug}`}>Book with this doctor</Button>
          <Button href={`tel:+919656656736`} variant="secondary">Call hospital</Button>
        </div>
      </PageHero>

      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Doctors', to: '/doctors' }, { label: doctor.name }]} />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-5">
            <div className="overflow-hidden rounded-[1.5rem] bg-sus-sand">
              <img src={doctor.image || '/images/doctor-portrait.jpg'} alt={`Portrait placeholder for ${doctor.name}`} className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-5 space-y-3 text-sm shadow-glass-dark text-ivory-50 font-body">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#FFC86B] font-bold">Availability</p>
                <p className="mt-1 text-white font-medium">{doctor.availability}</p>
              </div>
              {doctor.lineage && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#FFC86B] font-bold">Lineage</p>
                  <p className="mt-1 text-white font-medium">{doctor.lineage}</p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wider text-[#FFC86B] font-bold">Branches</p>
                <ul className="mt-1 space-y-1">
                  {docsBranches.map((b) => (
                    <li key={b.id}><Link className="text-[#FFC86B] hover:underline" href={`/branches/${b.slug}`}>{b.name}</Link></li>
                  ))}
                </ul>
              </div>
            </div>
            {doctor.confirmSlots?.map((c: string) => (
              <ConfirmSlot key={c} label={c} />
            ))}
          </div>

          <div className="lg:col-span-8 space-y-10 font-body">
            <AiSummary text={doctor.aiSummary} reviewedBy={doctor.name} />

            <section>
              <h2 className="font-display text-3xl text-white font-bold">Philosophy</h2>
              <blockquote className="mt-4 border-l-2 border-[#FFC86B] pl-5 font-display text-2xl text-white leading-snug">
                “{doctor.philosophy}”
              </blockquote>
              <p className="mt-4 text-ivory-200/90 leading-relaxed">{doctor.approach}</p>
            </section>

            <section>
              <h2 className="font-display text-3xl text-white font-bold">Education & standing</h2>
              <ul className="mt-4 space-y-2 font-body">
                {(doctor.education || []).map((e: string) => (
                  <li key={e} className="rounded-xl bg-[#1C1214]/95 border border-ochre/30 px-4 py-3 text-sm text-ivory-100 shadow-glass-dark">{e}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-3xl text-white font-bold">Specialisations</h2>
              <div className="mt-4 flex flex-wrap gap-2 font-body">
                {(doctor.specializations || []).map((s: string) => (
                  <span key={s} className="rounded-full bg-ochre/20 border border-ochre/40 px-3 py-1.5 text-sm text-[#FFC86B] font-medium">{s}</span>
                ))}
              </div>
              {doctor.pillars && doctor.pillars.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm uppercase tracking-wider text-[#FFC86B] font-bold">Pillars</h3>
                  <ul className="mt-2 list-disc pl-5 text-ivory-200/90 space-y-1">
                    {doctor.pillars.map((p: string) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              )}
            </section>

            {txs.length > 0 && (
              <section>
                <h2 className="font-display text-3xl text-white font-bold">Signature treatments</h2>
                <div className="mt-4 grid sm:grid-cols-2 gap-3 font-body">
                  {txs.map((t) => (
                    <Link key={t.id} href={`/treatments/${t.slug}`} className="rounded-xl border border-ochre/30 bg-[#1C1214]/95 px-4 py-3 hover:border-ochre shadow-glass-dark transition-all">
                      <span className="font-medium text-white block">{t.name}</span>
                      <span className="block text-xs text-[#FFC86B] mt-1">{t.category}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {specs.length > 0 && (
              <section>
                <h2 className="font-display text-3xl text-ochre">Conditions & pathways led</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {specs.map((s) => (
                    <Link key={s.id} href={`/conditions/${s.slug}`} className="rounded-full border border-ochre/30 px-3 py-1.5 text-sm text-ochre hover:bg-ochre/10">
                      {s.shortName}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {docsArticles.length > 0 && (
              <section>
                <h2 className="font-display text-3xl text-sus-ink">Articles</h2>
                <ul className="mt-4 space-y-3">
                  {docsArticles.map((a) => (
                    <li key={a.id}>
                      <Link href={`/knowledge/${a.slug}`} className="text-sus-ink hover:text-sus-crimson font-medium">
                        {a.title}
                      </Link>
                      <p className="text-sm text-sus-muted">{a.excerpt}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <h2 className="font-display text-3xl text-sus-ink mb-4">FAQ</h2>
              <FaqList
                items={[
                  {
                    q: 'How is availability confirmed?',
                    a: `${doctor.availability}. Online requests are confirmed by the hospital team against the live roster before you travel.`,
                  },
                  {
                    q: 'Can I request this doctor for a package stay?',
                    a: 'Yes — mention the doctor on the package enquiry form. Assignment depends on clinical fit and schedule.',
                  },
                ]}
              />
            </section>

            <div className="rounded-2xl bg-crimson-800 text-sus-cream p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl">Request a consultation</h2>
                <p className="text-sm text-sus-sand/80 mt-1">Respect published availability · confirmation required</p>
              </div>
              <Button to={`/book?doctor=${doctor.slug}`} variant="secondary">Book appointment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
