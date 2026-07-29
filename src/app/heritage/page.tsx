'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export default function HeritagePage() {
  const milestones = [
    { year: '1970', title: 'The Apothecary Foundation', desc: 'Dr. Ananda Varma opens the first clinical apothecary in Kerala, formulating authentic herbal oils from classical manuscripts.' },
    { year: '1992', title: 'Panchakarma Center Expansion', desc: 'Inauguration of our first residential retreat dedicated to multi-week bio-cleansing and metabolic restoration.' },
    { year: '2008', title: 'Integrative Clinical Research', desc: 'Establishing modern laboratory testing to empirically validate traditional dosha diagnostic markers.' },
    { year: '2024', title: 'Global Ultra-Luxury Sanctuaries', desc: 'Expanding Susrutha into a global network of ultra-luxury retreats combining ancient wisdom with state-of-the-art care.' }
  ];

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-16 pb-24">
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4">55 YEARS OF ANCESTRAL TRUST</Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Our Heritage & Lineage
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          For over five decades, Susrutha has remained steadfast in preserving the purity of ancient Ayurvedic medicine while elevating wellness hospitality to world-class standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {milestones.map((m, idx) => (
          <Card key={idx} variant="default" className="flex flex-col justify-between p-8 border-gold/20">
            <div>
              <span className="font-display text-4xl font-bold text-gold block mb-2">{m.year}</span>
              <h4 className="font-display text-2xl font-bold text-primary mb-3">{m.title}</h4>
              <p className="font-sans text-text-secondary text-xs leading-relaxed">{m.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
