'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { MILESTONES, SUSRUTHA_HERITAGE_INFO } from '@/data/susruthaData';
import { Award, Calendar, HeartHandshake, ShieldCheck, UserCheck } from 'lucide-react';

export default function HeritagePage() {
  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-16 pb-24">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4 uppercase tracking-widest">
          ESTABLISHED 1970 • 55 YEARS OF ANCESTRAL TRUST
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Our Heritage & Lineage
        </h1>
        <p className="font-sans text-text-secondary text-base sm:text-lg leading-relaxed">
          {SUSRUTHA_HERITAGE_INFO.ayurvedaPhilosophy}
        </p>
      </div>

      {/* Main Historical Story Banner */}
      <div className="bg-sand/30 border border-gold/20 rounded-3xl p-8 sm:p-12">
        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <span className="font-display text-2xl sm:text-3xl font-bold text-primary block">
            The Founding Tradition of Susrutha
          </span>
          <p className="font-sans text-text-secondary text-base leading-relaxed">
            {SUSRUTHA_HERITAGE_INFO.lineageHistory}
          </p>
        </div>
      </div>

      {/* Founder Tribute Section: Prof. Dr. Krishnankutty Nair */}
      <div className="bg-primary text-cream rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 text-center">
            <div className="relative inline-block border-4 border-gold/40 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/old_site/dr-krishnankutty-nair.jpg"
                alt="Prof. Dr. Krishnankutty Nair"
                className="w-full h-80 object-cover object-top"
              />
            </div>
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-medium">
              <Award className="w-4 h-4" />
              <span>In Memoriam • Former Chairman & Managing Director</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream">
              Prof. Dr. Krishnankutty Nair (Late)
            </h2>
            <p className="font-sans text-cream/80 text-sm sm:text-base leading-relaxed">
              Prof. Dr. Krishnankutty Nair was a Clinician, Professor, Retd. Government Servant, and Healthcare Visionary with over 40 years of profound clinical and academic experience in Ayurveda. He served as Superintendent and Head of the Department of Panchakarma at the Government Ayurveda Panchakarma Hospital, Trivandrum.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-cream/10 p-3 rounded-xl border border-cream/15">
                <span className="font-display text-gold text-sm font-semibold block">Pride of India Award</span>
                <span className="text-cream/70 text-xs">Excellence in Clinical Care</span>
              </div>
              <div className="bg-cream/10 p-3 rounded-xl border border-cream/15">
                <span className="font-display text-gold text-sm font-semibold block">Indira Gandhi Sadbhavana</span>
                <span className="text-cream/70 text-xs">National Recognition</span>
              </div>
              <div className="bg-cream/10 p-3 rounded-xl border border-cream/15">
                <span className="font-display text-gold text-sm font-semibold block">Bharath Jyothi Award</span>
                <span className="text-cream/70 text-xs">Ayurvedic Healthcare Pioneer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Managing Directors */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <Badge variant="gold" className="mb-2">CURRENT LEADERSHIP</Badge>
          <h3 className="font-display text-3xl font-bold text-primary">Carrying the Torch Forward</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 border-gold/20 flex flex-col sm:flex-row gap-6 items-center">
            <img
              src="/images/old_site/dr-krishnakumar.jpg"
              alt="Dr. Krishnakumar K."
              className="w-28 h-28 rounded-full object-cover border-2 border-gold"
            />
            <div>
              <h4 className="font-display text-xl font-bold text-primary">Dr. Krishnakumar K.</h4>
              <span className="text-gold text-xs font-semibold block mb-2">MD (Ayurveda) • Managing Director & Chief Physician</span>
              <p className="font-sans text-text-secondary text-xs leading-relaxed">
                Son of Prof. Dr. Krishnankutty Nair, bringing 28+ years of clinical specialization in Panchakarma, Spine & Joint rehabilitation.
              </p>
            </div>
          </Card>

          <Card className="p-8 border-gold/20 flex flex-col sm:flex-row gap-6 items-center">
            <img
              src="/images/old_site/dr-sreejakrishna.jpg"
              alt="Dr. Sreeja Krishna S."
              className="w-28 h-28 rounded-full object-cover border-2 border-gold"
            />
            <div>
              <h4 className="font-display text-xl font-bold text-primary">Dr. Sreeja Krishna S.</h4>
              <span className="text-gold text-xs font-semibold block mb-2">BAMS, MBA • Director & Senior Consultant</span>
              <p className="font-sans text-text-secondary text-xs leading-relaxed">
                Daughter of Prof. Dr. Krishnankutty Nair, leading Women’s Health, General Medicine, and hospital management across branches.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline Section */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="gold" className="mb-2">HISTORICAL TIMELINE</Badge>
          <h3 className="font-display text-3xl sm:text-4xl font-bold text-primary">
            Milestones in the History of Susrutha
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MILESTONES.map((m, idx) => (
            <Card key={idx} variant="default" className="p-6 border-gold/20 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-3xl font-bold text-gold">{m.year}</span>
                <Calendar className="w-5 h-5 text-gold/60" />
              </div>
              <h4 className="font-display text-lg font-bold text-primary mb-2">{m.title}</h4>
              <p className="font-sans text-text-secondary text-xs leading-relaxed">{m.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
