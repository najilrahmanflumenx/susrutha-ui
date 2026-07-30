'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Calendar,
  ChevronDown,
  BookOpen,
  History,
  PhoneCall,
  Loader2,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Building2,
  Newspaper,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { globalSearch, GlobalSearchResult } from '@/lib/api';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GlobalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Live Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await globalSearch(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Main navigation items customer sees first
  const primaryNavLinks = [
    { name: 'Treatments', href: '/treatments' },
    { name: 'Packages', href: '/retreats' },
    { name: 'Doctors', href: '/doctors' },
    { name: 'Facilities', href: '/ecosystem' },
    { name: 'Contact', href: '/contact' },
  ];

  // Secondary items inside "MORE" dropdown
  const secondaryNavLinks = [
    { name: 'Departments', href: '/departments', icon: Building2, desc: 'Specialty clinical divisions' },
    { name: 'Conditions', href: '/conditions', icon: Sparkles, desc: 'Ailments & health conditions treated' },
    { name: 'Media Gallery', href: '/gallery', icon: Sparkles, desc: 'Photo albums & video walkthroughs' },
    { name: 'Press & Accreditations', href: '/media-coverage', icon: Newspaper, desc: 'NABH certs & news features' },
    { name: 'Patient Reviews', href: '/testimonials', icon: Quote, desc: 'Patient stories, ratings & reviews' },
    { name: 'Ayurvedic Journal', href: '/journal', icon: BookOpen, desc: 'Articles & health insights' },
    { name: 'Heritage & Legacy', href: '/heritage', icon: History, desc: '55-Year clinical hospital story' },
    { name: 'FAQs & Help', href: '/faqs', icon: HelpCircle, desc: 'Common questions & patient guide' },
  ];

  const allNavLinksMobile = [
    { name: 'Home', href: '/' },
    ...primaryNavLinks,
    { name: 'Departments', href: '/departments' },
    { name: 'Conditions', href: '/conditions' },
    { name: 'Media Gallery', href: '/gallery' },
    { name: 'Press & Trust', href: '/media-coverage' },
    { name: 'Reviews', href: '/testimonials' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Blog', href: '/journal' },
    { name: 'Heritage', href: '/heritage' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full flex items-center justify-between px-4 sm:px-8 py-2.5',
          isScrolled
            ? 'w-[95%] sm:w-[94%] max-w-7xl glass-panel shadow-2xl border-primary/20 bg-surface/90 py-2 sm:py-2.5'
            : 'w-[96%] max-w-7xl bg-surface/75 backdrop-blur-md border border-primary/10 shadow-lg'
        )}
      >
        {/* Brand Logo (Acts as Home Link) */}
        <Link href="/" className="flex items-center group cursor-pointer shrink-0" aria-label="Susrutha Home">
          <img
            src="/images/logo.png"
            alt="Susrutha Institute of Ayurvedic Sciences"
            className="h-8 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
          />
        </Link>

        {/* Desktop Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {primaryNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-[11px] xl:text-xs font-sans font-bold tracking-[0.15em] transition-colors duration-300 relative py-1',
                  isActive
                    ? 'text-primary font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold'
                    : 'text-text-secondary hover:text-primary'
                )}
              >
                {link.name}
              </Link>
            );
          })}

          {/* MORE Dropdown Popover */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              className={cn(
                'flex items-center gap-1 text-[11px] xl:text-xs font-sans font-bold tracking-[0.15em] transition-colors duration-300 py-1',
                secondaryNavLinks.some((item) => pathname === item.href)
                  ? 'text-primary font-extrabold'
                  : 'text-text-secondary hover:text-primary'
              )}
            >
              <span>MORE</span>
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-300', isMoreDropdownOpen && 'rotate-180 text-gold')} />
            </button>

            {isMoreDropdownOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-gold/30 shadow-[0_25px_60px_rgba(0,0,0,0.4)] p-2.5 z-[100] animate-in fade-in zoom-in-95 duration-200 space-y-1">
                {secondaryNavLinks.map((sub) => {
                  const Icon = sub.icon;
                  const isSubActive = pathname === sub.href;
                  return (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setIsMoreDropdownOpen(false)}
                      className={cn(
                        'flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 group border border-transparent',
                        isSubActive
                          ? 'bg-gold/15 border-gold/30 text-primary font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700'
                      )}
                    >
                      <div className="p-2 rounded-lg bg-gold/10 group-hover:bg-gold text-gold group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-sans font-bold tracking-wider text-slate-900 dark:text-slate-100 group-hover:text-gold transition-colors">
                          {sub.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans leading-tight mt-0.5">
                          {sub.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-gold hover:text-primary transition-all active:scale-95 border border-primary/10"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link href="/booking">
            <Button variant="gold" size="sm" icon={<Calendar className="w-4 h-4" />}>
              <span className="hidden sm:inline">BOOK APPOINTMENT</span>
              <span className="sm:hidden">BOOK</span>
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-surface flex items-center justify-center shadow-sm"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-primary/95 backdrop-blur-2xl text-surface flex flex-col justify-between p-8 pt-28 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-5 text-center overflow-y-auto max-h-[75vh] py-4">
            {allNavLinksMobile.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'font-display text-xl sm:text-2xl tracking-widest transition-colors',
                  pathname === link.href ? 'text-gold font-bold' : 'hover:text-gold text-surface/90'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-surface/10 text-center">
            <Link href="/booking" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="gold" size="lg" className="w-full justify-center">
                BOOK CONSULTATION
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="Search Susrutha">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments, retreats, doctors, conditions..."
              className="w-full bg-surface-elevated border border-primary/20 rounded-2xl px-5 py-4 font-sans text-sm text-primary focus:outline-none focus:border-gold pr-10"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gold">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap text-xs">
            <span className="text-text-muted font-sans py-1">Popular:</span>
            {['Shirodhara', 'Panchakarma', 'Kattakada', 'Detox'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearchQuery(term)}
                className="bg-primary/5 hover:bg-gold hover:text-primary text-primary px-3 py-1 rounded-full cursor-pointer transition-colors font-sans font-medium"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Live Search Results */}
          {searchQuery.trim() && (
            <div className="max-h-72 overflow-y-auto space-y-2 pt-2 border-t border-primary/10">
              {isSearching ? (
                <div className="text-center py-6 text-xs text-text-muted font-sans">Searching hospital database...</div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-6 text-xs text-text-muted font-sans">No matching results found for &quot;{searchQuery}&quot;</div>
              ) : (
                searchResults.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.url}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-xs">
                        {item.type[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-dark bg-gold/10 px-2 py-0.5 rounded">
                          {item.type}
                        </span>
                        <h5 className="font-display font-bold text-sm text-primary truncate group-hover:text-gold transition-colors">
                          {item.title}
                        </h5>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-text-muted truncate mt-0.5 font-sans">{item.subtitle}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-gold group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
