'use client';

import Link from 'next/link';
import { Facebook, Instagram, ExternalLink, ShieldCheck, MapPin, Phone, Mail, Clock, Sparkles } from 'lucide-react';
import { brand, branches, verticals } from '../data/site';
import { Logo } from './Header';
import { Disclaimer } from './ui';

export default function Footer() {
  return (
    <footer className="bg-[#120A0B] text-ivory-100 border-t-4 border-crimson relative overflow-hidden font-body">
      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-crimson/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-ochre/10 blur-3xl pointer-events-none" />

      <div className="container-wide section-pad py-16 sm:py-20 relative z-10">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-6">
            <Logo light />
            <p className="text-sm leading-relaxed text-ivory-200/90 max-w-sm font-light">{brand.positioning}</p>
            
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFC86B]/40 bg-[#1C1214] px-4 py-1.5 text-xs text-[#FFC86B] font-semibold backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-[#FFC86B] shrink-0" />
              <span>NABH Accredited Ayurveda Hospital</span>
            </div>

            <p className="text-xs text-[#FFC86B]/80 font-medium">{brand.legalName}</p>

            
            <div className="flex items-center gap-3 pt-2">
              <a
                href={brand.contact.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-ochre/30 text-[#FFC86B] hover:bg-ochre-500 hover:text-ivory-950 hover:border-ochre-500 transition-all duration-300 shadow-soft-sm"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={brand.contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-ochre/30 text-[#FFC86B] hover:bg-ochre-500 hover:text-ivory-950 hover:border-ochre-500 transition-all duration-300 shadow-soft-sm"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Branches Col */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-xl text-[#FFC86B] font-bold tracking-tight">Care Locations</h3>
            <ul className="space-y-4 text-sm">
              {branches.map((b) => (
                <li key={b.id} className="group rounded-2xl border border-white/10 bg-[#1C1214] p-4 transition-all duration-300 hover:border-ochre/40">
                  <Link href={`/branches/${b.slug}`} className="font-semibold text-ivory-50 group-hover:text-[#FFC86B] transition-colors flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#FFC86B] shrink-0" />
                    <span>{b.name}</span>
                  </Link>
                  <p className="text-ivory-300/80 mt-1.5 text-xs leading-relaxed">{b.address}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-display text-xl text-[#FFC86B] font-bold tracking-tight">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Doctors', '/doctors'],
                ['Treatments', '/treatments'],
                ['Packages', '/packages'],
                ['Ayur Village', '/ayur-village'],
                ['Knowledge Centre', '/knowledge'],
                ['Facilities', '/facilities'],
                ['Video Showcase', '/videos'],
                ['Testimonials', '/testimonials'],
                ['International Desk', '/international-patients'],
                ['FAQs', '/faq'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link href={to} className="text-ivory-200/90 hover:text-[#FFC86B] transition-colors font-medium hover:translate-x-1 inline-block transform duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-xl text-[#FFC86B] font-bold tracking-tight">Direct Contact</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href={`tel:${brand.contact.mobileTel}`} className="text-ivory-100 hover:text-[#FFC86B] transition-colors font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#FFC86B] shrink-0" />
                  <span>{brand.contact.mobile}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${brand.contact.landlineTel}`} className="text-ivory-100 hover:text-[#FFC86B] transition-colors font-medium flex items-center gap-2 text-xs">
                  <Phone className="h-3.5 w-3.5 text-[#FFC86B]/80 shrink-0" />
                  <span>{brand.contact.landline}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.contact.email}`} className="text-ivory-100 hover:text-[#FFC86B] transition-colors font-medium flex items-center gap-2 text-xs">
                  <Mail className="h-3.5 w-3.5 text-[#FFC86B]/80 shrink-0" />
                  <span>{brand.contact.email}</span>
                </a>
              </li>
              <li className="text-ivory-300/80 text-xs flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#FFC86B]/80 shrink-0" />
                <span>OP Hours: {brand.hours.op}</span>
              </li>
              <li className="pt-2">
                <a
                  href={brand.contact.googleReview}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#FFC86B] hover:text-white bg-[#1C1214] border border-ochre/30 rounded-full px-4 py-2 transition-all duration-300"
                >
                  <span>Google Verified Reviews</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Verticals Bar */}
        <div className="mt-14 grid gap-4 border-t border-ochre/25 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <div key={v.name} className="text-sm rounded-2xl border border-ochre/30 bg-[#1C1214] p-3.5 shadow-glass-dark">
              {v.url ? (
                <a href={v.url} target="_blank" rel="noreferrer" className="text-[#FFC86B] hover:text-white inline-flex items-center gap-1.5 font-bold text-xs">
                  <span>{v.name}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-[#FFC86B] font-bold text-xs">{v.name}</span>
              )}
              <p className="text-ivory-300/80 text-xs mt-1 leading-relaxed">{v.detail}</p>
            </div>
          ))}
        </div>

        {/* Legal & Copyright */}
        <div className="mt-12 border-t border-ochre/25 pt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <Disclaimer />
          <p className="text-xs text-ivory-300/80 shrink-0 font-medium">© {new Date().getFullYear()} {brand.commonName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

