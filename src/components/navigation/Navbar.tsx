'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, Calendar, User, Stethoscope, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'TREATMENTS', href: '/treatments' },
    { name: 'RETREATS', href: '/retreats' },
    { name: 'HERITAGE', href: '/heritage' },
    { name: 'DOCTORS', href: '/doctors' },
    { name: 'LOCATIONS', href: '/locations' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full flex items-center justify-between px-3.5 sm:px-8 py-2 sm:py-3.5',
          isScrolled
            ? 'w-[95%] sm:w-[94%] max-w-7xl glass-panel shadow-2xl border-primary/20 bg-surface/90 py-2 sm:py-2.5'
            : 'w-[96%] max-w-7xl bg-surface/60 backdrop-blur-md border border-primary/10 shadow-lg'
        )}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group cursor-pointer" aria-label="Susrutha Home">
          <img
            src="/images/logo.png"
            alt="Susrutha Institute of Ayurvedic Sciences"
            className="h-8 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'text-xs font-sans font-bold tracking-[0.15em] transition-colors duration-300 relative py-1',
                  isActive
                    ? 'text-primary font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold'
                    : 'text-text-secondary hover:text-primary'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-gold hover:text-primary transition-all active:scale-95"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link href="/booking">
            <Button variant="gold" size="sm" icon={<Calendar className="w-4 h-4" />}>
              <span className="hidden xs:inline">RESERVE</span>
              <span className="xs:hidden">BOOK</span>
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-surface flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-primary/95 backdrop-blur-2xl text-surface flex flex-col justify-between p-8 pt-28 md:hidden animate-fade-in">
          <div className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-2xl tracking-widest hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

        </div>
      )}

      {/* Search Modal */}
      <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="Search Susrutha">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search treatments, retreats, doctors, condition..."
            className="w-full bg-surface-elevated border border-primary/20 rounded-2xl px-5 py-4 font-sans text-sm text-primary focus:outline-none focus:border-gold"
            autoFocus
          />
          <div className="flex gap-2 flex-wrap text-xs">
            <span className="text-text-muted font-sans py-1">Popular:</span>
            {['Shirodhara', 'Panchakarma', 'Dr. Vikram Varma', 'Rishikesh Retreat'].map((term) => (
              <span
                key={term}
                className="bg-primary/5 hover:bg-gold hover:text-primary text-primary px-3 py-1 rounded-full cursor-pointer transition-colors"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
