'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { timelineMilestones } from '../data/enrichment';
import { cn } from '../lib/utils';

export default function InteractiveTimeline({ compact = false }: { compact?: boolean }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const items = timelineMilestones;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-mile]'));
      if (!cards.length) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToIndex(i: number) {
    const el = scrollerRef.current;
    const card = el?.querySelectorAll<HTMLElement>('[data-mile]')[i];
    card?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
    setActive(i);
  }

  function step(dir: -1 | 1) {
    const next = Math.max(0, Math.min(items.length - 1, active + dir));
    scrollToIndex(next);
  }

  const progress = ((active + 1) / items.length) * 100;

  return (
    <div className="relative">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-sus-muted mb-2">
            <span>1970</span>
            <span>Progress · {items[active]?.year}</span>
            <span>Today</span>
          </div>
          <div className="h-1.5 rounded-full bg-sus-sand overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sus-green to-sus-gold"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: reduce ? 0 : 0.35 }}
            />
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            aria-label="Previous milestone"
            onClick={() => step(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ochre/40 bg-[#1C1214] text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next milestone"
            onClick={() => step(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ochre/40 bg-[#1C1214] text-white hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((m, i) => {
          const isActive = i === active;
          const isOpen = expanded === i;
          return (
            <motion.article
              key={m.year}
              data-mile
              layout
              className={cn(
                'snap-center shrink-0 rounded-2xl border bg-[#1C1214]/95 text-white transition-all shadow-glass-dark font-body',
                compact ? 'w-[16.5rem] sm:w-[18rem]' : 'w-[18rem] sm:w-[20rem]',
                isActive ? 'border-[#FFC86B] shadow-ochre-glow' : 'border-ochre/30',
              )}
            >
              <button
                type="button"
                className="w-full text-left p-5 sm:p-6"
                onClick={() => {
                  setExpanded(isOpen ? null : i);
                  scrollToIndex(i);
                }}
                aria-expanded={isOpen}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-3xl text-[#FFC86B] font-bold">{m.year}</p>
                  <span
                    className={cn(
                      'mt-1 h-2.5 w-2.5 rounded-full ring-4 ring-[#1C1214]',
                      isActive ? 'bg-[#FFC86B]' : 'bg-white/20',
                    )}
                  />
                </div>
                <h3 className="mt-2 font-display text-xl font-bold text-white">{m.title}</h3>
                <p className="mt-2 text-sm text-ivory-200/90 leading-relaxed font-body">{m.short}</p>
                <p className="mt-3 text-xs font-bold text-[#FFC86B]">{isOpen ? 'Hide details' : 'Open details'}</p>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-ochre/20 px-5 sm:px-6 pb-5 sm:pb-6 font-body">
                      <p className="pt-4 text-sm text-ivory-100 leading-relaxed">{m.detail}</p>
                      <ul className="mt-3 space-y-1.5">
                        {m.highlights.map((h) => (
                          <li key={h} className="text-xs text-ivory-300/80 flex gap-2">
                            <span className="text-[#FFC86B]">·</span> {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {items.map((m, i) => (
          <button
            key={m.year}
            type="button"
            aria-label={`Go to ${m.year}`}
            onClick={() => scrollToIndex(i)}
            className={cn(
              'h-2 rounded-full transition-all',
              i === active ? 'w-6 bg-sus-gold' : 'w-2 bg-sus-green/20 hover:bg-sus-green/40',
            )}
          />
        ))}
      </div>

      {expanded !== null && (
        <button
          type="button"
          className="sr-only"
          onClick={() => setExpanded(null)}
          aria-label="Close expanded milestone"
        >
          <X />
        </button>
      )}
    </div>
  );
}
