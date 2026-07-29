'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, ShieldCheck, Heart, Flame } from 'lucide-react';

export default function Interactive3DShowcase() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 30,
        y: (e.clientY / innerHeight - 0.5) * 30,
      });
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div
      style={{ backgroundColor: '#1A0506', color: '#FFFFFF' }}
      className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-2xl border border-ochre/40 font-body"
    >
      {/* Background Lighting Bloom */}
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-ochre/25 blur-[100px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-crimson-600/30 blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid gap-12 lg:grid-cols-12 items-center">
        {/* Left Interactive Narrative */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-[#FCAB28] shadow-ochre-glow shrink-0" />
            <span className="text-xs uppercase tracking-[0.28em] font-extrabold text-[#FCAB28] font-display">
              Interactive Sanctuary Architecture
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-[#FCAB28]/60 to-transparent" />
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white text-balance leading-tight">
            Cinematic Wellness Through Living Herbal Science.
          </h2>

          <p className="text-base sm:text-lg text-ivory-200 leading-relaxed font-light">
            Move your cursor across the scene to experience dynamic volumetric light, interactive depth parallax, and 3D herbal optics.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 text-sm font-medium">
            <div className="rounded-2xl border border-ochre/30 bg-[#280B0D] p-4 backdrop-blur-md">
              <Leaf className="h-5 w-5 text-ochre mb-2" />
              <div className="font-bold text-white">100% Organic Extracts</div>
              <div className="text-xs text-ochre-200 mt-1">Sourced from Western Ghats</div>
            </div>
            <div className="rounded-2xl border border-ochre/30 bg-[#280B0D] p-4 backdrop-blur-md">
              <Flame className="h-5 w-5 text-ochre mb-2" />
              <div className="font-bold text-white">Taila Paka Brewed</div>
              <div className="text-xs text-ochre-200 mt-1">Slow woodfire decoctions</div>
            </div>
          </div>
        </div>

        {/* Right Interactive Floating 3D Showcase Stage */}
        <div className="lg:col-span-6 flex justify-center">
          <motion.div
            style={{
              rotateX: -mousePos.y,
              rotateY: mousePos.x,
              transformStyle: 'preserve-3d',
            }}
            className="relative aspect-square w-full max-w-md rounded-3xl border border-ochre/50 bg-[#2A0C0E]/90 p-6 backdrop-blur-xl shadow-2xl flex items-center justify-center"
          >
            {/* Center Main Floating Vessel / Emblem */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="relative flex h-56 w-56 items-center justify-center rounded-full border-2 border-dashed border-ochre/60"
            >
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-tr from-[#FCAB28] via-[#F9A825] to-[#D98200] text-[#1A0506] shadow-ochre-glow">
                <Leaf className="h-20 w-20 stroke-[2.2]" />
              </div>
            </motion.div>

            {/* Orbiting Satellite Node 1 */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 left-8 rounded-2xl border border-ochre/50 bg-[#320D0F] px-4 py-2.5 backdrop-blur-md shadow-lg flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-ochre-400" />
              <span className="text-xs font-bold text-white">Prakriti Balance</span>
            </motion.div>

            {/* Orbiting Satellite Node 2 */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-8 right-8 rounded-2xl border border-ochre/50 bg-[#320D0F] px-4 py-2.5 backdrop-blur-md shadow-lg flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-ochre-400" />
              <span className="text-xs font-bold text-white">NABH Verified</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
