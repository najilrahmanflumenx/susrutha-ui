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
    variant === 'primary' && 'bg-crimson text-white hover:bg-crimson-600 shadow-soft-md hover:shadow-ochre-glow hover:-translate-y-0.5 border border-crimson-500/40',
    variant === 'secondary' && 'bg-white/80 backdrop-blur-md border border-ochre/60 text-ivory-900 hover:border-ochre hover:bg-white shadow-soft-sm hover:-translate-y-0.5 font-semibold',
    variant === 'outline' && 'border-2 border-crimson text-crimson hover:bg-crimson-50 font-semibold',
    variant === 'ghost' && 'bg-transparent text-ivory-900 hover:bg-ivory-100/80',
    variant === 'gold' && 'bg-ochre text-ivory-900 hover:bg-ochre-400 font-bold shadow-ochre-glow hover:-translate-y-0.5',
    variant === 'glass' && 'bg-white/20 backdrop-blur-md border border-white/40 text-white hover:bg-white/30 shadow-glass-card',
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
  light = false,
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
          <span className={cn('h-2 w-2 rounded-full shadow-ochre-glow shrink-0', light ? 'bg-[#FCAB28]' : 'bg-crimson')} />
          <span className={cn('text-xs uppercase tracking-[0.28em] font-extrabold font-display', light ? 'text-[#FCAB28]' : 'text-crimson-900')}>
            {eyebrow}
          </span>
          <span className={cn('h-px w-8', light ? 'bg-gradient-to-r from-[#FCAB28]/60 to-transparent' : 'bg-gradient-to-r from-crimson/50 to-transparent')} />
        </div>
      )}
      <h2
        className={cn(
          'font-display text-3xl sm:text-4xl lg:text-[2.85rem] font-bold text-balance tracking-tight leading-[1.18]',
          light ? 'text-ivory-50' : 'text-ivory-900',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn('mt-4 text-base sm:text-lg leading-relaxed font-body', light ? 'text-ivory-200/90' : 'text-ivory-700')}>
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
        variant === 'ochre' && 'bg-ochre-100 text-ochre-800 border border-ochre-300',
        variant === 'crimson' && 'bg-crimson-100 text-crimson-900 border border-crimson-200',
        variant === 'green' && 'bg-botanical-100 text-botanical-900 border border-botanical-200',
        variant === 'ivory' && 'bg-ivory-200 text-ivory-900 border border-ivory-300',
      )}
    >
      {children}
    </span>
  );
}

export function GlassCard({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border transition-all duration-300',
        dark
          ? 'border-white/10 bg-[#1E1B1B]/90 backdrop-blur-xl shadow-glass-dark text-ivory-50'
          : 'border-ochre/30 bg-white/95 backdrop-blur-xl shadow-glass-card hover:border-ochre/60',
        className,
      )}
    >
      {children}
    </div>
  );
}


export function ClinicalOverview({ text, reviewedBy }: { text: string; reviewedBy?: string }) {
  return (
    <aside className="rounded-3xl border border-ochre/30 bg-gradient-to-br from-ochre-50/80 to-ivory-50/80 p-6 sm:p-7 backdrop-blur-md shadow-soft-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 h-32 w-32 bg-ochre-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-ochre-600 shrink-0" />
        <p className="text-xs uppercase tracking-[0.2em] text-ochre-700 font-bold">Clinical Overview</p>
      </div>
      <p className="text-botanical-900 leading-relaxed font-medium text-base sm:text-lg">{text}</p>
      {reviewedBy && (
        <div className="mt-4 pt-3 border-t border-ochre/20 flex items-center gap-2 text-xs text-ivory-500 italic">
          <CheckCircle2 className="h-3.5 w-3.5 text-botanical-600" />
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
      <ol className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-ivory-500">
        <li>
          <Link href="/" className="hover:text-botanical-600 transition-colors font-medium">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-ivory-300">
              /
            </span>
            {item.to && i < items.length - 1 ? (
              <Link href={item.to} className="hover:text-botanical-600 transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-botanical-900 font-semibold" aria-current="page">
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
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className="rounded-3xl border border-ivory-200 bg-white/90 shadow-soft-sm overflow-hidden transition-all duration-300 hover:border-ochre/40"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className="font-display font-semibold text-botanical-900 text-lg sm:text-xl leading-snug">{item.q}</span>
              <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300', isOpen ? 'bg-botanical-700 text-ivory-50 border-botanical-700 rotate-180' : 'bg-ivory-100 text-botanical-800 border-ivory-200')}>
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 text-ivory-500 leading-relaxed border-t border-ivory-100 pt-4 font-body">
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
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ivory-200 bg-white shadow-soft-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-ochre/40 hover:shadow-soft-lg"
    >
      {image && (
        <div className="aspect-[16/10] overflow-hidden bg-ivory-100 relative">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-botanical-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {meta && <p className="text-xs uppercase tracking-[0.2em] text-ochre-800 font-extrabold mb-2">{meta}</p>}
        <h3 className="font-display text-xl sm:text-2xl font-bold text-crimson-950 group-hover:text-crimson transition-colors leading-snug">{title}</h3>
        <p className="mt-2.5 text-sm text-[#3B1F20] leading-relaxed flex-1 font-body font-medium">{description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-crimson group-hover:text-ochre-700 transition-colors">
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
    <section
      style={{ backgroundColor: '#160506', color: '#FDFBF7' }}
      className="relative overflow-hidden bg-gradient-to-b from-[#160506] via-[#1A0707] to-[#240809] text-white py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute inset-0 botanical-pattern opacity-10 pointer-events-none" aria-hidden="true" />
      <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-[#FCAB28]/15 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#C22626]/20 blur-3xl pointer-events-none" aria-hidden="true" />
      
      <div className="container-wide section-pad relative z-10">
        {eyebrow && (
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FCAB28]/40 bg-[#FCAB28]/10 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-[#FCAB28] font-bold mb-5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FCAB28] animate-pulse" />
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
      style={light ? { backgroundColor: '#240809', borderColor: 'rgba(252, 171, 40, 0.4)', color: '#FFFFFF' } : undefined}
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
            ? 'text-[#FCAB28]'
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
    <div className="rounded-3xl border border-ivory-200 bg-white p-6 shadow-soft-sm animate-pulse">
      <div className="h-44 w-full rounded-2xl bg-ivory-100 mb-4" />
      <div className="h-4 w-1/4 rounded bg-ivory-200 mb-2" />
      <div className="h-6 w-3/4 rounded bg-ivory-200 mb-3" />
      <div className="h-4 w-full rounded bg-ivory-100 mb-2" />
      <div className="h-4 w-2/3 rounded bg-ivory-100" />
    </div>
  );
}

export function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-botanical-900 font-body">
      {children}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-crimson-600 font-medium font-body" role="alert">
      {message}
    </p>
  );
}

export const inputClass =
  'w-full rounded-2xl border border-ivory-300 bg-white/95 px-4.5 py-3.5 text-botanical-900 placeholder:text-ivory-400 focus:border-botanical-500 focus:outline-none focus:ring-2 focus:ring-botanical-500/20 shadow-soft-sm transition font-body text-sm';


