'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { videoCategories } from '../../data/enrichment';
import { Breadcrumbs, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { cn } from '../../lib/utils';
import { getVideos } from '../../lib/api';

export default function VideoGalleryPage() {
  const [category, setCategory] = useState('All');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [videosList, setVideosList] = useState<any[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = pageTitle('Video Gallery');
    getVideos().then((apiVideos) => {
      if (apiVideos && Array.isArray(apiVideos) && apiVideos.length > 0) {
        const mapped = apiVideos.map((v: any) => ({
          id: v._id || v.youtubeId,
          title: v.title,
          youtubeId: v.youtubeId || (v.url ? v.url.split('v=')[1] : 'dQw4w9WgXcQ'),
          category: v.category || 'Facility Tour',
          description: v.description || 'Susrutha Ayurveda Hospital Video',
        }));
        setVideosList(mapped);
      }
    });
  }, []);

  const filtered = useMemo(
    () => (category === 'All' ? videosList : videosList.filter((v) => v.category === category)),
    [category, videosList],
  );
  const active = videosList.find((v) => v.id === activeId) || null;

  return (
    <div>
      <PageHero
        eyebrow="Media"
        title="Video gallery"
        description="Premium YouTube embeds for performance — educational and atmospheric pieces. Replace placeholders with Susrutha-owned films when ready."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Video gallery' }]} />

        <div className="flex flex-wrap gap-2 mb-8 font-body">
          {videoCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                category === c ? 'bg-crimson text-white shadow-soft-sm' : 'bg-[#1C1214] border border-ochre/30 text-white hover:bg-white/10',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5 font-body">
          {filtered.map((v, i) => (
            <motion.button
              key={v.id}
              type="button"
              onClick={() => setActiveId(v.id)}
              className={cn(
                'group relative w-full break-inside-avoid overflow-hidden rounded-2xl border border-ochre/30 bg-[#1C1214] text-left shadow-glass-dark hover:border-ochre transition-all',
                i % 3 === 0 ? 'aspect-[4/5]' : i % 3 === 1 ? 'aspect-video' : 'aspect-[5/4]',
              )}
              whileHover={reduce ? undefined : { y: -4 }}
            >
              <img
                src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120A0B]/95 via-[#120A0B]/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#FFC86B] text-[#120A0B] shadow-lg transition-transform group-hover:scale-110">
                  <Play className="h-6 w-6 fill-current" />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#FFC86B] font-bold">{v.category}</p>
                <h2 className="mt-1 font-display text-xl text-white font-bold leading-snug">{v.title}</h2>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveId(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              initial={reduce ? false : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? undefined : { scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white"
                onClick={() => setActiveId(null)}
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-video w-full">
                <iframe
                  title={active.title}
                  src={`https://www.youtube.com/embed/${active.youtubeId}?autoplay=1&rel=0`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-[#1C1214] border-t border-ochre/20 px-5 py-4 text-sus-cream">
                <h3 className="font-display text-xl">{active.title}</h3>
                <p className="mt-1 text-sm text-sus-sand/85">{active.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
