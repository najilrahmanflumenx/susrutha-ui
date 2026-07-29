'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CalendarHeart, Sparkles, ShieldCheck, BedDouble, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import ParticleCanvas from './ParticleCanvas';

export default function CinematicHero() {
  const titleWords = 'Authentic Kerala Ayurveda. Held to Hospital Excellence.'.split(' ');

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#120A0B] text-ivory-50 flex items-center justify-center">
      {/* Background Ambient Video / Volumetric Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-25 scale-105 transition-transform duration-1000"
          poster="/images/hero-ayurveda.jpg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-warm-sunlight-shining-through-green-leaves-41556-large.mp4" type="video/mp4" />
        </video>
        {/* Volumetric Radial Light Beams & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120A0B] via-[#120A0B]/60 to-transparent" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-ochre/20 blur-[120px] pointer-events-none" />
        <div className="absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-crimson/20 blur-[140px] pointer-events-none" />
      </div>

      {/* Floating Canvas Particles */}
      <ParticleCanvas />

      {/* Hero Content Container */}
      <div className="container-wide section-pad relative z-20 py-20 text-center flex flex-col items-center">
        {/* Top Floating Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-ochre/40 bg-ochre-900/40 px-4 py-1.5 backdrop-blur-md shadow-ochre-glow mb-6"
        >
          <Sparkles className="h-4 w-4 text-ochre" />
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-ochre-200">
            NABH Accredited Ayurveda Hospital & Research Institute
          </span>
        </motion.div>

        {/* Word-by-word Kinetic Headline Reveal */}
        <h1 className="max-w-4xl font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-ivory-50 text-balance tracking-tight leading-[1.1]">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-3"
              initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 max-w-2xl text-lg sm:text-xl text-ivory-200/90 leading-relaxed"
        >
          An immersive sanctuary combining 50+ years of documented family lineage with 40-bed clinical hospital discipline and dedicated Panchakarma suites.
        </motion.p>

        {/* Morphing Magnetic Action CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/book"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-ochre px-8 py-4 text-base font-bold text-[#120A0B] shadow-ochre-glow transition-all duration-300 hover:scale-105 hover:bg-ochre-400"
          >
            <CalendarHeart className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span>Book Consultation</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-ivory-200/30 bg-white/5 px-8 py-4 text-base font-semibold text-ivory-50 backdrop-blur-md transition-all duration-300 hover:border-ochre/60 hover:bg-white/10"
          >
            <span>Explore Our Sanctuary</span>
          </Link>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-ivory-200/80"
        >
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-ochre" /> Physician-Directed Care
          </span>
          <span className="inline-flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-ochre" /> 40-Bed Inpatient Hospital
          </span>
          <span className="inline-flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-ochre" /> Research & Diagnostics
          </span>
        </motion.div>
      </div>

      {/* Liquid Pulsing Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-80"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-ochre-200">Scroll to Explore</span>
        <div className="h-8 w-5 rounded-full border-2 border-ochre-300/60 p-1 flex justify-center">
          <div className="h-2 w-1.5 rounded-full bg-ochre shadow-spa-glow" />
        </div>
      </motion.div>
    </section>
  );
}
