'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Mail, Phone, Download, Building } from 'lucide-react';
import { fetchSiteSettings } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { BrochureModal } from '@/components/ui/BrochureModal';

export const Footer: React.FC = () => {
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const { data: siteSettings } = useApiData<Record<string, any>>(fetchSiteSettings, {});
  const general = siteSettings?.GENERAL || siteSettings?.GENERAL_SETTINGS || {};
  const social = siteSettings?.SOCIAL || {};

  const email = general.email || general.mainEmail || 'info@susruthaayurveda.com';
  const phone = general.phone || general.emergencyHotline || '+91 96566 56736';

  return (
    <>
      <footer className="w-full rounded-t-[48px] bg-primary text-surface px-6 sm:px-12 md:px-20 py-20 mt-32 flex flex-col justify-between relative overflow-hidden border-t border-gold/20 shadow-2xl">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
          {/* Brand Summary Column */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <Link href="/" className="inline-block mb-8">
                <img
                  src="/images/logo.png"
                  alt="Susrutha Logo"
                  className="h-14 w-auto filter brightness-110 object-contain"
                />
              </Link>
              <p className="text-text-muted font-sans text-sm leading-relaxed max-w-md mb-6">
                {general.tagline || 'Crafting multi-generational legacies of health, vitality, and inner tranquility through the authentic, scientific wisdom of Susrutha Ayurveda.'}
              </p>

              {/* Brochure Download Trigger */}
              <button
                onClick={() => setIsBrochureOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-primary transition-all duration-300 text-xs font-sans font-bold tracking-wider uppercase mb-8"
              >
                <Download className="w-4 h-4" />
                <span>Download E-Brochure (PDF)</span>
              </button>
            </div>

            <div className="flex gap-4 flex-wrap">
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-full border border-surface/20 flex items-center justify-center text-surface hover:bg-gold hover:text-primary hover:border-gold transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              <a
                href={`mailto:${email}`}
                className="w-11 h-11 rounded-full border border-surface/20 flex items-center justify-center text-surface hover:bg-gold hover:text-primary hover:border-gold transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="w-11 h-11 rounded-full border border-surface/20 flex items-center justify-center text-surface hover:bg-gold hover:text-primary hover:border-gold transition-all duration-300"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation & Services */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h5 className="text-gold font-sans text-xs font-bold uppercase tracking-[0.2em] mb-6">
                EXPERIENCES
              </h5>
              <ul className="space-y-3 font-sans text-xs font-semibold tracking-wider">
                <li>
                  <Link href="/treatments" className="text-surface/70 hover:text-gold transition-colors">
                    Treatments
                  </Link>
                </li>
                <li>
                  <Link href="/departments" className="text-surface/70 hover:text-gold transition-colors">
                    Departments
                  </Link>
                </li>
                <li>
                  <Link href="/retreats" className="text-surface/70 hover:text-gold transition-colors">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="text-surface/70 hover:text-gold transition-colors">
                    Doctors & Schedule
                  </Link>
                </li>
                <li>
                  <Link href="/ecosystem" className="text-surface/70 hover:text-gold transition-colors">
                    Rooms & Facilities
                  </Link>
                </li>
                <li>
                  <Link href="/locations" className="text-surface/70 hover:text-gold transition-colors">
                    Branches
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-gold font-sans text-xs font-bold uppercase tracking-[0.2em] mb-6">
                SUSRUTHA GROUP
              </h5>
              <ul className="space-y-3 font-sans text-xs font-semibold tracking-wider">
                <li>
                  <a
                    href="https://susruthacmt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-surface/70 hover:text-gold transition-colors flex items-center gap-1.5"
                  >
                    <span>Charitable Medical Trust</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://susruthaayurvedapharma.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-surface/70 hover:text-gold transition-colors flex items-center gap-1.5"
                  >
                    <span>Ayurvedic Pharma Unit</span>
                  </a>
                </li>
                <li>
                  <Link href="/heritage" className="text-surface/70 hover:text-gold transition-colors">
                    Advanced Nursing School
                  </Link>
                </li>
                <li>
                  <Link href="/heritage" className="text-surface/70 hover:text-gold transition-colors">
                    55+ Years Clinical Lineage
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-surface/70 hover:text-gold transition-colors">
                    Verified Patient Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h5 className="text-gold font-sans text-xs font-bold uppercase tracking-[0.2em] mb-6">
                JOURNAL
              </h5>
              <p className="text-surface/70 text-xs font-sans mb-4">
                Receive curated Ayurvedic wisdom twice monthly.
              </p>
              <div className="flex border-b border-surface/30 pb-2 items-center">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="bg-transparent border-none text-surface text-xs font-sans focus:outline-none placeholder:text-surface/40 flex-grow"
                />
                <button className="text-gold hover:text-surface transition-colors" aria-label="Subscribe">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Metadata */}
        <div className="w-full pt-8 border-t border-surface/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-surface/50">
          <span>© 1970 - {new Date().getFullYear()} Susrutha Institute of Ayurvedic Sciences. All rights reserved.</span>
          <div className="flex gap-6 tracking-widest uppercase text-[10px]">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold transition-colors">Patient Charter</a>
          </div>
        </div>
      </footer>

      {/* Brochure Modal */}
      <BrochureModal isOpen={isBrochureOpen} onClose={() => setIsBrochureOpen(false)} />
    </>
  );
};
