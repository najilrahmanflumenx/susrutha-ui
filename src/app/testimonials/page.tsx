'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Quote, Sparkles, MessageSquarePlus, Send, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fetchTestimonials, submitFeedback, TestimonialItem } from '@/lib/api';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', phone: '', rating: 5, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const loadData = async (targetPage: number) => {
    setLoading(true);
    const res = await fetchTestimonials({ page: targetPage, limit: 9 });
    setTestimonials(res.data || []);
    if (res.meta) {
      setTotalPages(res.meta.totalPages || 1);
      setTotalCount(res.meta.total || (res.data || []).length);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.message) return;
    setIsSubmitting(true);
    const res = await submitFeedback(feedbackForm);
    setIsSubmitting(false);
    setSubmittedMessage(res.message || 'Thank you for your valuable feedback!');
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmittedMessage(null);
      setFeedbackForm({ name: '', phone: '', rating: 5, message: '' });
      loadData(1);
    }, 1500);
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <Badge variant="gold" className="mb-4" icon={<Quote className="w-3.5 h-3.5" />}>
          PATIENT STORIES & REVIEWS
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Words of Healing
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed mb-6">
          Discover genuine experiences from individuals who underwent authentic Kerala Panchakarma therapies and specialized holistic care at Susrutha.
        </p>
        <Button variant="gold" icon={<MessageSquarePlus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          SHARE YOUR EXPERIENCE
        </Button>
      </div>

      {/* Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-3xl p-6 h-48" />
          ))}
        </div>
      )}

      {!loading && testimonials.length > 0 && (
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((item, idx) => {
              const id = item.id || item._id || `testi-${idx}`;
              return (
                <Card key={id} variant="default" className="flex flex-col justify-between p-6 shadow-sm hover:shadow-xl transition-all relative">
                  <Quote className="w-8 h-8 text-gold/20 absolute top-6 right-6" />
                  <div className="flex flex-col gap-4">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < (item.rating || 5) ? 'fill-gold text-gold' : 'text-primary/20'}`}
                        />
                      ))}
                    </div>
                    {/* Review Text */}
                    <p className="font-sans text-text-secondary text-sm leading-relaxed italic">
                      &ldquo;{item.reviewText}&rdquo;
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="mt-6 pt-4 border-t border-primary/10 flex flex-col">
                    <span className="font-display font-bold text-primary text-base">
                      {item.patientName}
                    </span>
                    <div className="flex items-center justify-between text-xs font-sans text-text-muted mt-0.5">
                      <span>{item.patientLocation || 'Patient'}</span>
                      {item.treatmentReceived && (
                        <span className="text-bronze font-semibold">{item.treatmentReceived}</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-primary/10">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                PREVIOUS
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-full font-sans text-xs font-bold transition-all ${
                      page === i + 1
                        ? 'bg-primary text-gold shadow-sm'
                        : 'text-text-muted hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                NEXT
              </Button>
            </div>
          )}
        </div>
      )}

      {!loading && testimonials.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No reviews published yet</p>
          <p className="font-sans text-text-muted text-sm">Be the first to share your experience with Susrutha!</p>
          <Button variant="gold" onClick={() => setIsModalOpen(true)}>Write a Review</Button>
        </div>
      )}

      {/* Feedback Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Share Your Testimonial">
        {submittedMessage ? (
          <div className="py-8 text-center flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="font-display text-xl text-primary font-bold">{submittedMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={feedbackForm.name}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                placeholder="e.g. Ananya Sharma"
                className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={feedbackForm.phone}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Rating</label>
              <select
                value={feedbackForm.rating}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: Number(e.target.value) })}
                className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
                <option value={4}>⭐⭐⭐⭐ (4/5) - Very Good</option>
                <option value={3}>⭐⭐⭐ (3/5) - Good</option>
                <option value={2}>⭐⭐ (2/5) - Average</option>
                <option value={1}>⭐ (1/5) - Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Your Experience / Review *</label>
              <textarea
                required
                rows={4}
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                placeholder="Share how your treatment or stay was..."
                className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <Button type="submit" variant="gold" className="w-full mt-2" disabled={isSubmitting} icon={<Send className="w-4 h-4" />}>
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
