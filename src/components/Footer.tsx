'use client';

import Link from 'next/link';
import { Facebook, Instagram, ExternalLink } from 'lucide-react';
import { brand, branches, verticals } from '../data/site';
import { Logo } from './Header';
import { Disclaimer } from './ui';

export default function Footer() {
  return (
    <footer className="bg-sus-green-deep text-sus-sand">
      <div className="container-wide section-pad py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-5">
            <Logo light />
            <p className="text-sm leading-relaxed text-sus-sand/80 max-w-sm">{brand.positioning}</p>
            <p className="text-sm text-sus-sand/70">{brand.legalName}</p>
            <div className="flex gap-3">
              <a
                href={brand.contact.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:bg-white/10"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={brand.contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:bg-white/10"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-xl text-sus-cream mb-4">Branches</h3>
            <ul className="space-y-4 text-sm">
              {branches.map((b) => (
                <li key={b.id}>
                  <Link href={`/branches/${b.slug}`} className="font-medium text-sus-cream hover:text-sus-gold-soft">
                    {b.name}
                  </Link>
                  <p className="text-sus-sand/70 mt-1">{b.address}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-display text-xl text-sus-cream mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              {[
                ['Doctors', '/doctors'],
                ['Treatments', '/treatments'],
                ['Packages', '/packages'],
                ['Knowledge Centre', '/knowledge'],
                ['Ecosystem', '/ecosystem'],
                ['Video gallery', '/videos'],
                ['Testimonials', '/testimonials'],
                ['International', '/international-patients'],
                ['FAQ', '/faq'],
                ['Media', '/media'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link href={to} className="hover:text-sus-gold-soft">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-display text-xl text-sus-cream mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${brand.contact.mobileTel}`} className="hover:text-sus-gold-soft">
                  {brand.contact.mobile}
                </a>
              </li>
              <li>
                <a href={`tel:${brand.contact.landlineTel}`} className="hover:text-sus-gold-soft">
                  {brand.contact.landline}
                </a>
              </li>
              <li>
                <a href={`mailto:${brand.contact.email}`} className="hover:text-sus-gold-soft">
                  {brand.contact.email}
                </a>
              </li>
              <li className="text-sus-sand/70">OP {brand.hours.op}</li>
              <li className="text-sus-sand/70">Pharmacy {brand.hours.pharmacy}</li>
              <li>
                <a
                  href={brand.contact.googleReview}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sus-gold-soft hover:text-white"
                >
                  Google reviews <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {verticals.map((v) => (
            <div key={v.name} className="text-sm">
              {v.url ? (
                <a href={v.url} target="_blank" rel="noreferrer" className="text-sus-cream hover:text-sus-gold-soft inline-flex items-center gap-1">
                  {v.name} <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-sus-cream">{v.name}</span>
              )}
              <p className="text-sus-sand/65 mt-1">{v.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Disclaimer />
          <p className="text-xs text-sus-sand/50 shrink-0">© {new Date().getFullYear()} {brand.commonName}</p>
        </div>
      </div>
    </footer>
  );
}
