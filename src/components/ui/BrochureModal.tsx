'use client';

import React, { useState } from 'react';
import { Download, FileText, X, Sparkles, CheckCircle2, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloaded(true);

    // Trigger synthetic file download or open brochure info
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/docs/susrutha-brochure.pdf';
      link.setAttribute('download', 'Susrutha-Panchakarma-Hospital-Brochure.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-surface-card border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-primary/5 text-primary/60 hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-gold block mb-1">
            OFFICIAL E-BROCHURE & TARIFF
          </span>
          <h3 className="font-display text-2xl font-bold text-primary">
            Download Susrutha Guide
          </h3>
          <p className="text-xs font-sans text-text-secondary mt-1 leading-relaxed">
            Get comprehensive details on Panchakarma treatment tariffs, room tariffs, senior doctor credentials & hospital facilities.
          </p>
        </div>

        {downloaded ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display text-xl font-bold text-primary">
              Download Triggered!
            </h4>
            <p className="text-xs font-sans text-text-secondary max-w-xs mx-auto">
              Your official PDF brochure is downloading. If it doesn&apos;t start automatically, click below.
            </p>
            <div className="pt-2">
              <Button
                variant="gold"
                size="sm"
                onClick={() => setDownloaded(false)}
                icon={<Download className="w-4 h-4" />}
              >
                DOWNLOAD AGAIN
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-sans font-bold uppercase tracking-wider text-primary block mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-bronze" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 bg-surface-elevated text-xs font-sans text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-primary block mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-bronze" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 bg-surface-elevated text-xs font-sans text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-sans font-bold uppercase tracking-wider text-primary block mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-bronze" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-primary/20 bg-surface-elevated text-xs font-sans text-primary focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button variant="gold" className="w-full" icon={<Download className="w-4 h-4" />}>
                DOWNLOAD E-BROCHURE PDF
              </Button>
            </div>

            <p className="text-[10px] font-sans text-text-muted text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Privacy Protected. No Spam.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
