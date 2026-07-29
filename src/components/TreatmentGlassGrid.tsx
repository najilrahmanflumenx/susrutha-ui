import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Sun, Droplet } from 'lucide-react';
import Link from 'next/link';
import { getTreatments } from '../lib/api';

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
  const [liveItems, setLiveItems] = useState<any[]>(items || []);

  useEffect(() => {
    if (!items || items.length === 0) {
      getTreatments({ limit: 4 }).then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setLiveItems(data);
        }
      });
    } else {
      setLiveItems(items);
    }
  }, [items]);

  const activeItems = liveItems.length > 0 ? liveItems : items;

  const treatmentsData = activeItems && activeItems.length > 0
    ? activeItems.map((t, idx) => ({
        slug: t.slug || t._id,
        name: t.title || t.name,
        tagline: t.tagline || t.shortDescription || 'Authentic Ayurvedic Care',
        desc: t.fullDescription || t.overview || t.desc || 'Physician-directed traditional therapy prepared with bio-herbal oils.',
        icon: [Flame, ShieldCheck, Sun, Droplet][idx % 4],
        image: t.coverImage || t.image || t.thumbnail || ['/images/panchakarma.jpg', '/images/hero-ayurveda.jpg', '/images/kerala-nature.jpg'][idx % 3],
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
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ochre/30 border-t-2 border-t-[#FFC86B] bg-[#1C1214]/95 p-6 sm:p-7 shadow-glass-dark backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-ochre hover:shadow-ochre-glow"
            >
              {/* Top Tag & Icon */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre/20 border border-ochre/40 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#FFC86B]">
                  <Sparkles className="h-3 w-3 text-[#FFC86B] shrink-0" /> {t.tag}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white group-hover:bg-crimson group-hover:text-white transition-colors shadow-soft-sm">
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>

              {/* Treatment Image */}
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-ochre/20 mb-5 bg-[#120A0B]">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120A0B]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-xl font-bold text-white group-hover:text-[#FFC86B] transition-colors leading-snug">
                {t.name}
              </h3>
              <p className="mt-1 text-xs font-semibold text-[#FFC86B]">{t.tagline}</p>
              <p className="mt-2.5 text-xs text-ivory-200/90 leading-relaxed font-body flex-1 line-clamp-3">
                {t.desc}
              </p>

              {/* CTA Link */}
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#FFC86B] group-hover:text-white transition-colors">
                <span>View Full Procedure</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

