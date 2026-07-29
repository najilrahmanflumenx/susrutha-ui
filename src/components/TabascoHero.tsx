'use client';

import { motion } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import ParticleCanvas from './ParticleCanvas';

export default function TabascoHero() {
  const headlineWords = ['The', 'Living', 'Sanctuary', 'of', 'Kerala', 'Ayurveda.'];

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#1E1B1B] text-ivory-50 flex items-center justify-center font-body">
      {/* Background Media Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-25 scale-105 filter saturate-[0.9] contrast-[1.05]"
          poster="/images/hero-ayurveda.jpg"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-warm-sunlight-shining-through-green-leaves-41556-large.mp4"
            type="video/mp4"
          />
        </video>
        
        {/* Volumetric Gradient Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B1B] via-[#1E1B1B]/70 to-[#1E1B1B]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B1B]/80 via-transparent to-[#1E1B1B]/80" />
        <div className="absolute -left-36 top-1/3 h-[550px] w-[550px] rounded-full bg-crimson-600/20 blur-[150px] pointer-events-none" />
        <div className="absolute -right-36 bottom-1/4 h-[550px] w-[550px] rounded-full bg-ochre/15 blur-[160px] pointer-events-none" />
      </div>

      {/* Floating Particle Canvas */}
      <ParticleCanvas />

      {/* Hero Layout */}
      <div className="container-wide section-pad relative z-20 py-24 sm:py-32 text-center flex flex-col items-center">
        {/* Top Heritage & NABH Luxury Editorial Seal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-3.5 mb-8"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#FCAB28]/15 border border-[#FCAB28]/50 text-ochre-400 font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
            NABH
          </div>
          <span className="h-4 w-px bg-ochre/40" />
          <span className="text-xs uppercase tracking-[0.28em] font-extrabold text-[#FCAB28] font-display">
            Accredited Ayurveda Hospital · Est. 1986
          </span>
        </motion.div>

        {/* Editorial Headline */}
        <h1 className="max-w-5xl font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-ivory-50 text-balance tracking-tight leading-[1.06]">
          {headlineWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-3 sm:mr-4"
              initial={{ opacity: 0, y: 35, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-8 max-w-2xl text-lg sm:text-2xl text-ivory-200/90 font-light leading-relaxed tracking-wide"
        >
          Over 55 years of Ayurvedic family lineage — 40-bed clinical hospital, authentic bio-herbal therapies, and serene Ayur Village retreat stays.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-11 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <Link
            href="/book"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-ochre via-ochre-400 to-ochre-500 px-8 py-4 text-base font-bold text-ivory-900 shadow-ochre-glow transition-all duration-300 hover:scale-105"
          >
            <Calendar className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span>Book Consultation</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </Link>

          <Link
            href="/ayur-village"
            className="inline-flex items-center gap-2 rounded-full border border-ochre/40 bg-white/10 px-8 py-4 text-base font-semibold text-ivory-50 backdrop-blur-md transition-all duration-300 hover:border-ochre hover:bg-white/20"
          >
            <HeartHandshake className="h-5 w-5 text-ochre" />
            <span>Explore Ayur Village</span>
          </Link>
        </motion.div>

        {/* Trust Badges Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-ivory-300/80 font-medium"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ochre-400" />
            <span>55+ Years Ayurvedic Lineage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-botanical-400" />
            <span>40-Bed Hospital Facility</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-ochre-400" />
            <span>Kattakada & Kowdiar Clinics</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-80"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-ochre-300">
          Scroll to Explore
        </span>
        <div className="h-8 w-4.5 rounded-full border-2 border-ochre-300/50 p-1 flex justify-center">
          <div className="h-2 w-1 rounded-full bg-ochre shadow-spa-glow" />
        </div>
      </motion.div>
    </section>
  );
}

