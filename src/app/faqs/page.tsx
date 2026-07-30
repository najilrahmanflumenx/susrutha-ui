'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, Sparkles, MessageCircle, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { fetchFaqs, FAQItem } from '@/lib/api';

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchFaqs();
      setFaqs(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    faqs.forEach((f) => {
      const c = (f.category || '').trim();
      if (c) cats.set(c.toLowerCase(), c);
    });
    return ['ALL', ...Array.from(cats.values())];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchesCategory =
        selectedCategory.toUpperCase() === 'ALL' ||
        (f.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.category || '').toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-4xl mx-auto flex flex-col gap-10 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <Badge variant="gold" className="mb-4" icon={<HelpCircle className="w-3.5 h-3.5" />}>
          PATIENT KNOWLEDGE BASE
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Frequently Asked Questions
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Find clarity on Ayurvedic procedures, inpatient panchakarma stays, diet, consultation booking, and what to expect during your healing journey.
        </p>
      </div>

      {/* Live Search Bar */}
      <div className="relative w-full max-w-xl mx-auto">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gold shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpenIndex(0);
          }}
          placeholder="Search questions by keyword (e.g., Panchakarma, admission, diet)..."
          className="w-full bg-surface-elevated border border-primary/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-sans focus:outline-none focus:border-gold shadow-sm"
        />
      </div>

      {/* Dynamic Category Filter Chips */}
      {categories.length > 1 && (
        <div className="flex justify-center items-center gap-2.5 flex-wrap">
          {categories.map((cat) => (
            <Chip
              key={cat}
              active={selectedCategory.toLowerCase() === cat.toLowerCase()}
              onClick={() => {
                setSelectedCategory(cat);
                setOpenIndex(0);
              }}
            >
              {cat === 'ALL' ? 'All Topics' : cat}
            </Chip>
          ))}
        </div>
      )}

      {/* Accordion List */}
      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-2xl h-16" />
          ))}
        </div>
      )}

      {!loading && filteredFaqs.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || faq._id || idx}
                className="bg-surface-card border border-primary/10 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-display font-bold text-lg text-primary hover:text-gold transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {faq.category && (
                      <span className="text-[10px] font-sans font-extrabold tracking-widest uppercase text-bronze px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 shrink-0">
                        {faq.category}
                      </span>
                    )}
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gold shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 font-sans text-text-secondary text-sm leading-relaxed border-t border-primary/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredFaqs.length === 0 && (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No questions found</p>
          <p className="font-sans text-text-muted text-sm">Have a question not listed here? Get in touch with us!</p>
          <Link href="/contact">
            <Button variant="gold">Contact Support</Button>
          </Link>
        </div>
      )}

      {/* Still Have Questions Box */}
      <div className="p-8 rounded-3xl bg-primary text-surface text-center flex flex-col items-center gap-4 mt-4 shadow-xl">
        <MessageCircle className="w-8 h-8 text-gold" />
        <h3 className="font-display text-2xl font-bold">Have More Questions?</h3>
        <p className="font-sans text-sm text-surface/70 max-w-md">
          Our patient coordinators are available to answer any questions about treatments, accommodation, or travel to our Kattakada campus.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/contact">
            <Button variant="gold">SEND ENQUIRY</Button>
          </Link>
          <Link href="/booking">
            <Button variant="outline" className="border-surface text-surface hover:bg-surface/10">BOOK CONSULTATION</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
