'use client';

import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight, Stethoscope, Sparkles, Pill, TestTube, Phone } from 'lucide-react';

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '919656656736';

  const options = [
    {
      icon: Stethoscope,
      title: 'OPD Doctor Consultation',
      desc: 'Inquire about doctor availability & appointments',
      text: 'Hello, I would like to inquire about OPD Doctor Consultation availability at Susrutha Hospital.',
    },
    {
      icon: Sparkles,
      title: 'Inpatient Panchakarma Admission',
      desc: 'Information on 7/14/21 day treatment stays',
      text: 'Hello, I am interested in Inpatient Panchakarma Treatment Package & Room availability.',
    },
    {
      icon: Pill,
      title: 'Pharmacy & Medicine Delivery',
      desc: 'Order genuine Susrutha Ayurvedic formulations',
      text: 'Hello, I want to order Ayurvedic medicines from Susrutha Pharmacy.',
    },
    {
      icon: TestTube,
      title: 'Diagnostic Lab Sampling',
      desc: 'Inquire about lab investigations & reports',
      text: 'Hello, I would like to inquire about Susrutha Medi-Tech diagnostic laboratory services.',
    },
  ];

  const handleSelect = (text: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary/95 text-white border border-gold/40 shadow-2xl backdrop-blur-md hover:bg-primary transition-all duration-300 hover:scale-105 hover:border-gold"
          aria-label="Open WhatsApp Support"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-sand">
            Concierge
          </span>
        </button>
      </div>

      {/* Luxury Glassmorphism Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-surface-card border border-gold/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-5 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-primary/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-emerald-700">
                    ONLINE CONCIERGE
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-primary">
                  Susrutha WhatsApp Desk
                </h3>
                <p className="text-xs font-sans text-text-secondary mt-0.5">
                  How can our medical team assist you today?
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-primary/5 text-primary/60 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {options.map((opt, i) => {
                const IconComponent = opt.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt.text)}
                    className="w-full text-left p-3.5 rounded-2xl bg-surface-elevated border border-primary/10 hover:border-gold/60 hover:bg-primary/5 transition-all group flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white transition-colors shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-sans font-bold text-primary group-hover:text-gold transition-colors">
                          {opt.title}
                        </h4>
                        <p className="text-[11px] font-sans text-text-secondary mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-bronze group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Footer Direct Hotline Call */}
            <div className="pt-3 border-t border-primary/10 flex items-center justify-between text-xs font-sans text-text-secondary">
              <span>Direct Phone Hotline:</span>
              <a
                href="tel:+919656656736"
                className="font-bold text-gold hover:text-primary flex items-center gap-1"
              >
                <Phone className="w-3 h-3" />
                +91 9656656736
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
