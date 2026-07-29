'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Award, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DoctorItem } from '@/lib/api';

interface DoctorCarouselProps {
  doctors: DoctorItem[];
  autoPlayInterval?: number;
}

export function DoctorCarousel({ doctors, autoPlayInterval = 4000 }: DoctorCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Handle responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const totalSlides = Math.ceil(doctors.length / itemsPerPage);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, totalSlides, autoPlayInterval]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  if (!doctors || doctors.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
            showing {doctors.length} Expert Vaidyas & Physicians
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="w-10 h-10 rounded-full border border-primary/20 bg-surface-card flex items-center justify-center text-primary hover:bg-gold hover:text-white hover:border-gold transition-all shadow-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="w-10 h-10 rounded-full border border-primary/20 bg-surface-card flex items-center justify-center text-primary hover:bg-gold hover:text-white hover:border-gold transition-all shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel Outer Track */}
      <div className="w-full overflow-hidden rounded-3xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIdx) => {
            const slideDoctors = doctors.slice(slideIdx * itemsPerPage, (slideIdx + 1) * itemsPerPage);

            return (
              <div
                key={slideIdx}
                className="w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-1"
              >
                {slideDoctors.map((doctor, docIdx) => {
                  const id = doctor.id || doctor._id || `doc-${slideIdx}-${docIdx}`;
                  const slug = doctor.slug || id;
                  const name = doctor.name || 'Ayurvedic Physician';
                  const designation = doctor.designation || doctor.title || 'Senior Consultant';
                  const specialization = doctor.specialization || (doctor.specialties ? doctor.specialties[0] : 'Panchakarma');
                  const expYears = doctor.experienceYears || 15;
                  const photo = doctor.photoUrl || doctor.photo || doctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80';
                  const bio = doctor.bio || 'Expert physician committed to holistic patient wellness and classical Panchakarma care.';

                  return (
                    <Card key={id} variant="default" className="flex flex-col justify-between p-7 group shadow-sm hover:shadow-xl transition-all duration-300">
                      <div>
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                          <img
                            src={photo}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <Badge variant="gold" className="mb-2 uppercase text-[10px] tracking-wider font-bold">
                          {specialization}
                        </Badge>
                        <h3 className="font-display text-2xl font-bold text-primary mb-1 leading-snug">
                          <Link href={`/doctors/${slug}`} className="hover:underline">
                            {name}
                          </Link>
                        </h3>
                        <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze block mb-3">
                          {designation} • {expYears} Yrs Exp.
                        </span>
                        <p className="font-sans text-text-secondary text-xs leading-relaxed line-clamp-3 mb-6">
                          {bio}
                        </p>
                      </div>

                      <Link href={`/booking?doctor=${encodeURIComponent(name)}`}>
                        <Button variant="gold" className="w-full" size="sm" icon={<ChevronRightIcon className="w-4 h-4" />}>
                          CONSULT DOCTOR
                        </Button>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicators / Slide Dots */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-8 bg-gold' : 'w-2 bg-primary/20 hover:bg-primary/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
