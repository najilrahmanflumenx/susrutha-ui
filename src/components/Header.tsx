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
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { brand } from '../data/site';
import { searchSite } from '../lib/search';
import { cn } from '../lib/utils';
import { getTreatments, getConditions, getDoctors } from '../lib/api';

export function Logo({ light = false }: { light?: boolean }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="Susrutha Ayurveda home">
      {!imgError ? (
        <div className="relative flex items-center justify-center p-0.5 transition-transform duration-300 group-hover:scale-105">
          <img
            src="/images/logo.png"
            alt="Susrutha Institute of Ayurvedic Sciences"
            onError={() => setImgError(true)}
            className="h-10 sm:h-12 w-auto object-contain mix-blend-screen filter brightness-110 drop-shadow-md"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#FCAB28]/15 border border-[#FCAB28]/50 text-[#FCAB28] shadow-soft-sm transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-[#FCAB28]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white leading-none group-hover:text-[#FCAB28] transition-colors">
              Susrutha
            </span>
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#FCAB28] font-bold mt-0.5">
              Ayurveda Hospital
            </span>
          </div>
        </div>
      )}
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
    <div ref={ref} className="relative w-full max-w-xs" role="combobox" aria-haspopup="listbox" aria-expanded={open && results.length > 0} aria-owns="search-results-list">
      <label htmlFor="site-search" className="sr-only">
        Search the site
      </label>
      <div className="flex items-center gap-2.5 rounded-full border border-ochre/35 bg-[#1C1214]/80 backdrop-blur-md px-4 py-2.5 text-white shadow-soft-sm focus-within:border-ochre focus-within:ring-2 focus-within:ring-ochre/25 transition-all duration-300">
        <Search className="h-4 w-4 text-ochre-400 shrink-0" aria-hidden="true" />
        <input
          id="site-search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search treatments, doctors…"
          className="w-full bg-transparent text-sm text-white placeholder:text-ivory-300/70 focus:outline-none font-body"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="search-results-list"
        />
      </div>
      {open && q.trim().length >= 2 && (
        <div
          id="search-results-list"
          role="listbox"
          className="absolute right-0 z-50 mt-2.5 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-3xl border border-ochre/40 bg-[#1C1214]/95 backdrop-blur-xl shadow-glass-card text-white"
        >
          {results.length === 0 ? (
            <div className="px-5 py-4 text-sm text-ivory-300 font-body">No matches found. Try searching for Panchakarma, Spine, Doctor, or Kowdiar…</div>
          ) : (
            <ul className="max-h-80 overflow-auto py-2 divide-y divide-white/10">
              {results.map((r) => (
                <li key={r.path + r.title} role="option" aria-selected={false}>
                  <Link
                    href={r.path}
                    onClick={() => {
                      setOpen(false);
                      setQ('');
                      onNavigate?.();
                    }}
                    className="block px-5 py-3 hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-[#FFC86B] font-bold">{r.type}</span>
                    <span className="flex items-center justify-between text-sm font-semibold text-white group-hover:text-[#FFC86B]">
                      {r.title}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FFC86B]" />
                    </span>
                    <span className="block text-xs text-ivory-200/70 line-clamp-1 font-body mt-0.5">{r.description}</span>
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
        { label: 'View All Physicians', to: '/doctors' },
      ],
    },
    {
      key: 'explore',
      label: 'Explore',
      to: '/about',
      cols: [
        { label: 'Our Heritage & Legacy', to: '/about' },
        { label: 'Ayur Village Retreat', to: '/ayur-village' },
        { label: 'Curative Packages', to: '/packages' },
        { label: 'Care Locations', to: '/branches' },
        { label: 'Knowledge Centre', to: '/knowledge' },
        { label: 'International Patients', to: '/international-patients' },
        { label: 'Hospital Infrastructure', to: '/facilities' },
        { label: 'Video Showcase', to: '/videos' },
        { label: 'Press & Media', to: '/media' },
      ],
    },
  ];

  return (
    <nav className="hidden lg:flex items-center gap-1.5" aria-label="Primary">
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
                'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 font-body',
                isActive
                  ? 'text-[#FCAB28] bg-[#240809] border border-[#FCAB28]/50'
                  : 'text-[#FDFBF7] hover:text-[#FCAB28] hover:bg-white/10',
              )}
            >
              {menu.label}
              <ChevronDown className={cn('h-3.5 w-3.5 opacity-70 transition-transform duration-300', openMenu === menu.key && 'rotate-180 text-[#FCAB28]')} />
            </Link>
            {openMenu === menu.key && (
              <div className="absolute left-0 top-full z-50 pt-2 animate-fadeIn">
                <div
                  style={{ backgroundColor: '#240809', borderColor: 'rgba(252, 171, 40, 0.4)' }}
                  className="min-w-[18rem] rounded-3xl border p-3.5 shadow-2xl backdrop-blur-xl"
                >
                  <ul className="space-y-1">
                    {menu.cols.map((item) => (
                      <li key={item.to}>
                        <Link
                          href={item.to}
                          className="flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm text-[#FDFBF7] font-semibold hover:bg-[#351012] hover:text-[#FCAB28] transition-all font-body group"
                          onClick={() => setOpenMenu(null)}
                        >
                          <span>{item.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#FCAB28]" />
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
          'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 font-body',
          pathname === '/contact' ? 'text-[#FCAB28] bg-[#240809] border border-[#FCAB28]/50' : 'text-[#FDFBF7] hover:text-[#FCAB28] hover:bg-white/10',
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
    <header
      style={{ backgroundColor: 'rgba(22, 5, 6, 0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', color: '#FFFFFF' }}
      className="sticky top-0 z-40 border-b border-ochre/30 shadow-2xl backdrop-blur-2xl transition-all duration-300 font-body bg-[#160506]/85"
    >
      <div className="container-wide section-pad flex items-center justify-between gap-4 py-3.5">
        <Logo />
        <DesktopMega />
        <div className="hidden md:block">
          <SearchBox />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/book"
            className="hidden sm:inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-crimson-600 via-crimson to-crimson-700 px-6 py-2.5 text-sm font-bold text-ivory-50 shadow-soft-md hover:shadow-ochre-glow hover:bg-crimson-700 transition-all duration-300 transform hover:-translate-y-0.5 border border-ochre/50"
          >
            <Calendar className="h-4 w-4 text-ochre-300" />
            <span>Book Appointment</span>
          </Link>
          <button
            type="button"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-ochre/40 bg-[#240809] text-white shadow-soft-sm hover:border-ochre transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div style={{ backgroundColor: '#1A0707' }} className="lg:hidden border-t border-ochre/30 backdrop-blur-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="section-pad space-y-5 py-6">
            <SearchBox onNavigate={() => setMobileOpen(false)} />
            <div className="grid gap-1.5 font-body">
              {[
                ['Treatments', '/treatments'],
                ['Conditions', '/conditions'],
                ['Doctors', '/doctors'],
                ['Packages', '/packages'],
                ['Branches', '/branches'],
                ['Ayur Village', '/ayur-village'],
                ['Knowledge Centre', '/knowledge'],
                ['About & Legacy', '/about'],
                ['International Patients', '/international-patients'],
                ['Hospital Facilities', '/facilities'],
                ['Videos', '/videos'],
                ['Contact Us', '/contact'],
                ['Book Appointment', '/book'],
              ].map(([label, to]) => (
                <Link
                  key={to}
                  href={to}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-white hover:bg-[#240809] font-semibold transition-colors border border-transparent hover:border-ochre/30"
                >
                  <span>{label}</span>
                  <ArrowUpRight className="h-4 w-4 text-ochre-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


