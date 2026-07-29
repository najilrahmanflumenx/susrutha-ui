'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CinematicCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('.interactive') ||
        target?.tagName === 'INPUT'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    }

    function onMouseDown() {
      setClicking(true);
    }
    function onMouseUp() {
      setClicking(false);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Outer Floating Ring */}
      <motion.div
        className="absolute h-10 w-10 rounded-full border border-ochre-400/60 bg-ochre-400/10 backdrop-blur-[1px]"
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: clicking ? 0.8 : hovered ? 1.8 : 1,
        }}
        transition={{ type: 'spring', damping: 28, stiffness: 350, mass: 0.5 }}
      />
      {/* Center Botanical Core Dot */}
      <motion.div
        className="absolute h-2.5 w-2.5 rounded-full bg-ochre shadow-ochre-glow"
        animate={{
          x: pos.x - 5,
          y: pos.y - 5,
          scale: clicking ? 0.6 : hovered ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 40, stiffness: 500 }}
      />
    </div>
  );
}
