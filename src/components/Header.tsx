'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Menu,
  X,
  Phone,
  Search,
  ChevronDown,
  CalendarHeart,
} from 'lucide-react';
import { brand } from '../data/site';
import { searchSite } from '../lib/search';
import { cn } from '../lib/utils';
import { getTreatments, getConditions, getDoctors } from '../lib/api';

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="Susrutha Ayurveda home">
      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-full border',
          light ? 'border-sus-gold-soft/50 bg-sus-green text-sus-gold-soft' : 'border-sus-gold/30 bg-sus-green-deep text-sus-gold-soft',
        )}
      >
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
          <path
            d="M20 6c-1.2 5-5 8.8-10 10 5 1.2 8.8 5 10 10 1.2-5 5-8.8 10-10-5-1.2-8.8-5-10-10z"
            fill="currentColor"
            opacity="0.95"
          />
          <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.55" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className={cn('block font-display text-xl sm:text-2xl tracking-wide', light ? 'text-sus-cream' : 'text-sus-green-deep')}>
          Susrutha
        </span>
        <span className={cn('block text-[10px] uppercase tracking-[0.2em]', light ? 'text-sus-sand/80' : 'text-sus-muted')}>
          Ayurveda · Since 1986
        </span>
      </span>
    </Link>
  );
}

export function SearchBox({ onNavigate }: { onNavigate?: () => void }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchSite(q), [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <label htmlFor="site-search" className="sr-only">
        Search the site
      </label>
      <div className="flex items-center gap-2 rounded-full border border-sus-green/15 bg-white/90 px-3 py-2">
        <Search className="h-4 w-4 text-sus-muted" aria-hidden="true" />
        <input
          id="site-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search treatments, doctors…"
          className="w-full bg-transparent text-sm text-sus-ink placeholder:text-sus-muted/70 focus:outline-none"
          autoComplete="off"
        />
      </div>
      {open && q.trim().length >= 2 && (
        <div className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-2xl border border-sus-green/10 bg-white shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-sus-muted">No matches. Try Panchakarma, fertility, Kowdiar…</p>
          ) : (
            <ul className="max-h-80 overflow-auto py-2">
              {results.map((r) => (
                <li key={r.path + r.title}>
                  <Link
                    href={r.path}
                    onClick={() => {
                      setOpen(false);
                      setQ('');
                      onNavigate?.();
                    }}
                    className="block px-4 py-2.5 hover:bg-sus-cream"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-sus-gold">{r.type}</span>
                    <span className="block text-sm font-medium text-sus-green-deep">{r.title}</span>
                    <span className="block text-xs text-sus-muted line-clamp-1">{r.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function DesktopMega() {
  const [treatmentsList, setTreatmentsList] = useState<any[]>([]);
  const [conditionsList, setConditionsList] = useState<any[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    Promise.all([getTreatments(), getConditions(), getDoctors()]).then(([txs, conds, docs]) => {
      if (txs && Array.isArray(txs) && txs.length > 0) setTreatmentsList(txs);
      if (conds && Array.isArray(conds) && conds.length > 0) setConditionsList(conds);
      if (docs && Array.isArray(docs) && docs.length > 0) setDoctorsList(docs);
    });
  }, []);

  const menus = [
    {
      key: 'treatments',
      label: 'Treatments',
      to: '/treatments',
      cols: treatmentsList.length > 0
        ? treatmentsList.slice(0, 8).map((t) => ({ label: t.title || t.name, to: `/treatments/${t.slug}` }))
        : [{ label: 'All Treatments', to: '/treatments' }],
    },
    {
      key: 'conditions',
      label: 'Conditions',
      to: '/conditions',
      cols: conditionsList.length > 0
        ? conditionsList.map((s) => ({ label: s.title || s.name, to: `/conditions/${s.slug}` }))
        : [{ label: 'All Conditions', to: '/conditions' }],
    },
    {
      key: 'doctors',
      label: 'Doctors',
      to: '/doctors',
      cols: [
        ...doctorsList.filter((d) => d.isDirector).map((d) => ({ label: d.name, to: `/doctors/${d.slug}` })),
        { label: 'Full roster', to: '/doctors' },
      ],
    },
    {
      key: 'explore',
      label: 'Explore',
      to: '/about',
      cols: [
        { label: 'About & legacy', to: '/about' },
        { label: 'Branches', to: '/branches' },
        { label: 'Ayur Village', to: '/ayur-village' },
        { label: 'Packages', to: '/packages' },
        { label: 'Knowledge Centre', to: '/knowledge' },
        { label: 'International patients', to: '/international-patients' },
        { label: 'Ecosystem', to: '/ecosystem' },
        { label: 'Facilities', to: '/facilities' },
        { label: 'Video gallery', to: '/videos' },
        { label: 'Media', to: '/media' },
      ],
    },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
      {menus.map((menu) => {
        const isActive = pathname.startsWith(menu.to);
        return (
          <div
            key={menu.key}
            className="relative"
            onMouseEnter={() => setOpenMenu(menu.key)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              href={menu.to}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'text-sus-green' : 'text-sus-ink/80 hover:text-sus-green',
              )}
            >
              {menu.label}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Link>
            {openMenu === menu.key && (
              <div className="absolute left-0 top-full z-50 pt-2">
                <div className="min-w-[16rem] rounded-2xl border border-sus-green/10 bg-white p-3 shadow-xl">
                  <ul className="space-y-0.5">
                    {menu.cols.map((item) => (
                      <li key={item.to}>
                        <Link
                          href={item.to}
                          className="block rounded-xl px-3 py-2 text-sm text-sus-ink hover:bg-sus-cream hover:text-sus-green"
                          onClick={() => setOpenMenu(null)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
      <Link
        href="/contact"
        className={cn(
          'rounded-full px-3 py-2 text-sm font-medium',
          pathname === '/contact' ? 'text-sus-green' : 'text-sus-ink/80 hover:text-sus-green',
        )}
      >
        Contact
      </Link>
    </nav>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="bg-sus-green-deep text-sus-sand/90">
        <div className="container-wide section-pad flex flex-wrap items-center justify-between gap-2 py-2 text-xs">
          <p className="hidden sm:block">{brand.legacyFraming}</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={`tel:${brand.contact.mobileTel}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3.5 w-3.5" /> {brand.contact.mobile}
            </a>
            <span className="hidden md:inline text-sus-sand/60">OP {brand.hours.op}</span>
            <span className="text-sus-gold-soft">Hospital {brand.hours.hospital}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-sus-green/10 bg-sus-cream/90 backdrop-blur-md">
        <div className="container-wide section-pad flex items-center justify-between gap-4 py-3">
          <Logo />
          <DesktopMega />
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-sus-green px-4 py-2.5 text-sm font-medium text-sus-cream hover:bg-sus-green-deep transition-colors"
            >
              <CalendarHeart className="h-4 w-4" /> Book
            </Link>
            <button
              type="button"
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-sus-green/15 bg-white"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-sus-green/10 bg-sus-cream">
            <div className="section-pad space-y-4 py-4">
              <SearchBox onNavigate={() => setMobileOpen(false)} />
              <div className="grid gap-1">
                {[
                  ['Treatments', '/treatments'],
                  ['Conditions', '/conditions'],
                  ['Doctors', '/doctors'],
                  ['Packages', '/packages'],
                  ['Branches', '/branches'],
                  ['Ayur Village', '/ayur-village'],
                  ['Knowledge', '/knowledge'],
                  ['About', '/about'],
                  ['International', '/international-patients'],
                  ['Ecosystem', '/ecosystem'],
                  ['Videos', '/videos'],
                  ['Contact', '/contact'],
                  ['Book appointment', '/book'],
                ].map(([label, to]) => (
                  <Link key={to} href={to} className="rounded-xl px-3 py-3 text-sus-green-deep hover:bg-white font-medium">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
