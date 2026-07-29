'use client';

import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import { ChevronDown, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, useReducedMotion } from 'framer-motion';

export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  type = 'button',
  className,
  disabled,
}: {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'outline' | 'glass';
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}) {
  const styles = cn(
    'relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden',
    variant === 'primary' && 'bg-gradient-to-r from-crimson via-[#9F0311] to-crimson-700 text-white hover:brightness-110 shadow-soft-md hover:shadow-ochre-glow hover:-translate-y-0.5 border border-[#FFC86B]/40 font-bold',
    variant === 'secondary' && 'bg-[#1C1214] backdrop-blur-md border border-ochre/60 text-white hover:border-ochre hover:bg-[#281B1E] shadow-glass-dark hover:-translate-y-0.5 font-semibold',
    variant === 'outline' && 'border-2 border-[#FFC86B] text-[#FFC86B] hover:bg-[#FFC86B]/10 font-semibold',
    variant === 'ghost' && 'bg-transparent text-white hover:bg-white/10',
    variant === 'gold' && 'bg-ochre text-[#120A0B] hover:bg-ochre-400 font-bold shadow-ochre-glow hover:-translate-y-0.5',
    variant === 'glass' && 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 shadow-glass-card',
    className,
  );

  const targetUrl = to || href;

  if (targetUrl) {
    if (targetUrl.startsWith('http') || targetUrl.startsWith('tel:') || targetUrl.startsWith('mailto:')) {
      return (
        <a href={targetUrl} className={styles} target={targetUrl.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </a>
      );
    }
    return (
      <Link href={targetUrl} className={styles}>
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles} disabled={disabled}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
}) {
  return (
    <div className={cn(align === 'center' && 'text-center mx-auto max-w-3xl')}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2.5 mb-3.5">
          <span className="h-2 w-2 rounded-full shadow-ochre-glow shrink-0 bg-[#FFC86B]" />
          <span className="text-xs uppercase tracking-[0.28em] font-extrabold font-display text-[#FFC86B]">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-[#FFC86B]/60 to-transparent" />
        </div>
      )}
      <h2
        className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-bold text-balance tracking-tight leading-[1.18] text-ivory-50"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed font-body text-ivory-200/90">
          {description}
        </p>
      )}
    </div>
  );
}

export function Badge({ children, variant = 'ochre' }: { children: ReactNode; variant?: 'ochre' | 'crimson' | 'green' | 'ivory' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider',
        variant === 'ochre' && 'bg-ochre/20 text-[#FFC86B] border border-ochre/40',
        variant === 'crimson' && 'bg-crimson/20 text-white border border-crimson/40',
        variant === 'green' && 'bg-crimson/15 text-crimson-100 border border-crimson/30',
        variant === 'ivory' && 'bg-white/10 text-ivory-100 border border-white/20',
      )}
    >
      {children}
    </span>
  );
}

export function GlassCard({
  children,
  className,
  dark = true,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-ochre/30 bg-[#1C1214]/95 backdrop-blur-xl shadow-glass-dark text-ivory-50 hover:border-ochre/60 transition-all duration-300',
        className,
      )}
    >
      {children}
    </div>
  );
}


export function ClinicalOverview({ text, reviewedBy }: { text: string; reviewedBy?: string }) {
  return (
    <aside className="rounded-3xl border border-ochre/40 bg-gradient-to-br from-[#1C1214] to-[#281B1E] p-6 sm:p-7 backdrop-blur-md shadow-glass-dark relative overflow-hidden text-ivory-50">
      <div className="absolute top-0 right-0 h-32 w-32 bg-ochre-200/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-[#FFC86B] shrink-0" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#FFC86B] font-bold">Clinical Overview</p>
      </div>
      <p className="text-ivory-100 leading-relaxed font-medium text-base sm:text-lg">{text}</p>
      {reviewedBy && (
        <div className="mt-4 pt-3 border-t border-ochre/20 flex items-center gap-2 text-xs text-ivory-300/80 italic">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#FFC86B]" />
          <span>Medically reviewed by {reviewedBy}</span>
        </div>
      )}
    </aside>
  );
}

export const AiSummary = ClinicalOverview;


export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-ivory-300/80">
        <li>
          <Link href="/" className="hover:text-[#FFC86B] transition-colors font-medium">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-ivory-300/40">
              /
            </span>
            {item.to && i < items.length - 1 ? (
              <Link href={item.to} className="hover:text-[#FFC86B] transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#FFC86B] font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-4 font-body">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="rounded-3xl border border-ochre/30 bg-[#1C1214]/95 shadow-glass-dark overflow-hidden transition-all duration-300 hover:border-ochre/60"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-display font-semibold text-white text-lg sm:text-xl leading-snug">{item.q}</span>
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300', isOpen ? 'bg-[#FFC86B] text-[#120A0B] border-[#FFC86B] rotate-180' : 'bg-white/10 text-white border-ochre/30')}>
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-ivory-200/90 leading-relaxed border-t border-ochre/20 pt-4 font-body">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CardLink({
  to,
  title,
  description,
  meta,
  image,
}: {
  to: string;
  title: string;
  description: string;
  meta?: string;
  image?: string;
}) {
  return (
    <Link
      href={to}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ochre/30 bg-[#1C1214]/95 shadow-glass-dark transition-all duration-500 hover:-translate-y-1.5 hover:border-ochre hover:shadow-ochre-glow"
    >
      {image && (
        <div className="aspect-[16/10] overflow-hidden bg-[#120A0B] relative">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120A0B]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {meta && <p className="text-xs uppercase tracking-[0.2em] text-[#FFC86B] font-extrabold mb-2">{meta}</p>}
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#FFC86B] transition-colors leading-snug">{title}</h3>
        <p className="mt-2.5 text-sm text-ivory-200/90 leading-relaxed flex-1 font-body font-medium">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FFC86B] group-hover:text-white transition-colors">
          <span>Explore Details</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#120A0B] via-[#1C1214] to-[#241316] text-white py-20 sm:py-24 lg:py-28 font-body">
      <div className="absolute inset-0 botanical-pattern opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-[#FCAB28]/15 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#C22626]/20 blur-3xl pointer-events-none" aria-hidden="true" />
      
      <div className="container-wide section-pad relative z-10">
        {eyebrow && (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FFC86B]/40 bg-[#FFC86B]/10 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-[#FFC86B] font-bold mb-5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFC86B] animate-pulse" />
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="max-w-4xl font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-balance tracking-tight leading-[1.12]">
          {title}
        </h1>
        {description && (
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-[#FDFBF7]/90 leading-relaxed font-body font-light">
            {description}
          </p>
        )}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}

export function Disclaimer() {
  return (
    <p className="text-xs leading-relaxed text-ivory-400 font-body">
      Educational information only. Susrutha Ayurveda does not provide diagnosis via this website and does not promise
      cures. Always consult a qualified physician. In emergencies, use local emergency services and our emergency
      contact numbers.
    </p>
  );
}

export function ConfirmSlot({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ochre/40 bg-ochre-50/40 px-5 py-4 text-sm text-ivory-500 font-body">
      Content pending verification: {label}
    </div>
  );
}

export function Stat({ value, label, light = true }: { value: string; label: string; light?: boolean }) {
  return (
    <div
      style={light ? { backgroundColor: '#1C1214', borderColor: 'rgba(252, 171, 40, 0.4)', color: '#FFFFFF' } : undefined}
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-5 sm:p-6 transition-all duration-300 backdrop-blur-md',
        light
          ? 'shadow-none'
          : 'border-ochre/25 bg-white shadow-soft-sm hover:border-ochre/50 hover:-translate-y-0.5'
      )}
    >
      <div
        className={cn(
          'font-display text-4xl sm:text-5xl font-bold tracking-tight transition-transform duration-300 group-hover:scale-105',
          light
            ? 'text-[#FFC86B]'
            : 'text-crimson-900 group-hover:text-crimson'
        )}
      >
        {value}
      </div>
      <div className={cn('mt-2 text-xs sm:text-sm font-semibold font-body leading-relaxed', light ? 'text-[#FDFBF7]' : 'text-ivory-800')}>
        {label}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-ochre/20 bg-[#1C1214]/90 p-6 shadow-glass-dark">
      <div className="h-44 w-full rounded-2xl bg-white/5 mb-4" />
      <div className="h-4 w-1/3 rounded bg-white/10 mb-3" />
      <div className="h-6 w-3/4 rounded bg-white/10 mb-3" />
      <div className="h-4 w-full rounded bg-white/5 mb-2" />
      <div className="h-4 w-2/3 rounded bg-white/5" />
    </div>
  );
}

export function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-ivory-100 font-body">
      {children}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-red-400 font-semibold font-body" role="alert">
      {message}
    </p>
  );
}

export const inputClass =
  'w-full rounded-2xl border border-ochre/30 bg-[#120A0B]/90 px-4.5 py-3.5 text-white placeholder:text-ivory-400/60 focus:border-[#FFC86B] focus:outline-none focus:ring-2 focus:ring-[#FFC86B]/25 shadow-glass-dark transition font-body text-sm';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-2 font-body mt-8', className)}>
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-xl border border-ochre/30 bg-[#1C1214] px-4 py-2 text-xs font-bold text-white hover:bg-ochre/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        ← Previous
      </button>

      <div className="flex items-center gap-1.5 px-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              'h-9 w-9 rounded-xl text-xs font-bold transition-all',
              p === currentPage
                ? 'bg-gradient-to-r from-crimson via-[#9F0311] to-crimson-700 text-white border border-[#FFC86B]/40 shadow-soft-md'
                : 'border border-ochre/20 bg-[#1C1214]/60 text-ivory-200 hover:border-ochre/40 hover:text-[#FFC86B]',
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-xl border border-ochre/30 bg-[#1C1214] px-4 py-2 text-xs font-bold text-white hover:bg-ochre/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next →
      </button>
    </div>
  );
}



