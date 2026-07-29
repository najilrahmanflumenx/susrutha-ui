'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Sun, Droplet } from 'lucide-react';
import Link from 'next/link';

const defaultTreatments = [
  {
    slug: 'panchakarma',
    name: 'Panchakarma Detoxification',
    tagline: '5-Stage Complete Cellular Purification',
    desc: 'The ultimate Ayurvedic cleansing therapy — Vamana, Virechana, Vasti, Nasya, and Raktamokshana under physician oversight.',
    icon: Flame,
    image: '/images/panchakarma.jpg',
    tag: 'Signature Therapy',
  },
  {
    slug: 'spine-joint-care',
    name: 'Spine & Joint Rehabilitation',
    tagline: 'Kati Vasti, Patra Pinda & Elakizhi',
    desc: 'Targeted bio-herbal oil retention and warm herbal poultice massages for disc prolapse, arthritis, and spondylosis.',
    icon: ShieldCheck,
    image: '/images/hero-ayurveda.jpg',
    tag: 'Orthopedic Care',
  },
  {
    slug: 'rasayana-rejuvenation',
    name: 'Rasayana & Immunity Building',
    tagline: 'Tissue Longevity & Vitality Protocol',
    desc: 'Restorative therapy designed to enhance Ojas (vital energy), arrest premature aging, and rebuild cellular resilience.',
    icon: Sun,
    image: '/images/kerala-nature.jpg',
    tag: 'Wellness',
  },
  {
    slug: 'shirodhara',
    name: 'Shirodhara Nervous Harmony',
    tagline: 'Continuous Medicated Oil Pouring',
    desc: 'Rhythmic warm herbal oil stream over the third-eye chakra to dissolve anxiety, insomnia, hypertension, and stress.',
    icon: Droplet,
    image: '/images/panchakarma.jpg',
    tag: 'Neurological Care',
  },
];

export default function TreatmentGlassGrid({ items }: { items?: any[] }) {
  const treatmentsData = items && items.length > 0
    ? items.map((t, idx) => ({
        slug: t.slug || t._id,
        name: t.title || t.name,
        tagline: t.tagline || t.shortDescription || 'Authentic Ayurvedic Care',
        desc: t.fullDescription || t.overview || t.desc || 'Physician-directed traditional therapy prepared with bio-herbal oils.',
        icon: [Flame, ShieldCheck, Sun, Droplet][idx % 4],
        image: t.image || t.thumbnail || ['/images/panchakarma.jpg', '/images/hero-ayurveda.jpg', '/images/kerala-nature.jpg'][idx % 3],
        tag: t.category || t.tag || 'Specialty Therapy',
      }))
    : defaultTreatments;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-body">
      {treatmentsData.map((t, index) => {
        const IconComponent = t.icon || Flame;
        return (
          <motion.div
            key={t.slug + index}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: index * 0.08 }}
          >
            <Link
              href={`/treatments/${t.slug}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ivory-200 border-t-2 border-t-ochre bg-white p-6 sm:p-7 shadow-soft-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-ochre hover:shadow-soft-lg"
            >
              {/* Top Tag & Icon */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre-100/80 border border-ochre-300 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ochre-800">
                  <Sparkles className="h-3 w-3 text-ochre-600 shrink-0" /> {t.tag}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-crimson-50 text-crimson group-hover:bg-crimson group-hover:text-white transition-colors shadow-soft-sm">
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              {/* Treatment Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ivory-200/80 mb-5 bg-ivory-100">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-crimson-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-xl font-bold text-ivory-900 group-hover:text-crimson transition-colors leading-snug">
                {t.name}
              </h3>
              <p className="mt-1 text-xs font-semibold text-ochre-700">{t.tagline}</p>
              <p className="mt-3 text-sm text-[#3B1F20] font-medium leading-relaxed flex-1 font-body">{t.desc}</p>

              {/* Action Link */}
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-crimson group-hover:text-ochre transition-colors">
                <span>Explore Protocol</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

