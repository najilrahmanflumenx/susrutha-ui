'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Sparkles, Building2, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { submitContactLead, submitFeedback, fetchBranchesList, BranchItem } from '@/lib/api';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'INQUIRY' | 'FEEDBACK'>('INQUIRY');
  const [branches, setBranches] = useState<BranchItem[]>([]);

  // General Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    branchId: '',
  });

  // Rating & Feedback Form State
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    phone: '',
    rating: 5,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchBranchesList();
      setBranches(data);
    }
    load();
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitting(true);
    const res = await submitContactLead(formData);
    setIsSubmitting(false);
    setSubmitResult({
      success: res.success,
      message: res.message || 'Thank you for reaching out. We will get back to you shortly.',
    });
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.message) return;
    setIsSubmitting(true);
    const res = await submitFeedback(feedbackForm);
    setIsSubmitting(false);
    setSubmitResult({
      success: res.success,
      message: res.message || 'Thank you for your valuable rating and feedback!',
    });
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="gold" className="mb-4" icon={<Mail className="w-3.5 h-3.5" />}>
          GET IN TOUCH & PATIENT FEEDBACK
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Reach Our Healing Sanctuary
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Send us a general inquiry or share your treatment rating & experience with our medical care team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Sidebar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card variant="default" className="p-8 flex flex-col gap-6">
            <h3 className="font-display text-2xl font-bold text-primary">Headquarters & Inpatient Campus</h3>

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">Kattakada Campus</span>
                <p className="font-sans text-sm text-text-secondary leading-relaxed">
                  Kattakada-Killi Main Road, Thiruvananthapuram, Kerala - 695572, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-primary/10 pt-4">
              <Phone className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">Phone / WhatsApp</span>
                <p className="font-sans text-sm text-text-secondary font-semibold">+91 96566 56736</p>
                <p className="font-sans text-sm text-text-secondary">+91 471 229 0256</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-primary/10 pt-4">
              <Mail className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">Email Enquiry</span>
                <p className="font-sans text-sm text-text-secondary font-semibold">kattakada@susruthaayurveda.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border-t border-primary/10 pt-4">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-1" />
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">OPD Consultation Hours</span>
                <p className="font-sans text-sm text-text-secondary">09:00 AM - 07:00 PM (Mon - Sun)</p>
              </div>
            </div>
          </Card>

          {/* Quick Info Card */}
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-4">
            <Building2 className="w-8 h-8 text-gold shrink-0" />
            <div className="font-sans text-xs text-text-secondary leading-relaxed">
              <strong>Need a city consultation?</strong> Visit our Kowdiar City Outpatient Clinic in Thiruvananthapuram city center.
            </div>
          </div>
        </div>

        {/* Main Form Section (7 cols) */}
        <div className="lg:col-span-7">
          {/* Tab Switcher */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('INQUIRY');
                setSubmitResult(null);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                activeTab === 'INQUIRY'
                  ? 'bg-primary text-gold border-primary shadow-md'
                  : 'bg-surface-elevated text-text-secondary border-primary/15 hover:border-gold'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              General Inquiry
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('FEEDBACK');
                setSubmitResult(null);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                activeTab === 'FEEDBACK'
                  ? 'bg-primary text-gold border-primary shadow-md'
                  : 'bg-surface-elevated text-text-secondary border-primary/15 hover:border-gold'
              }`}
            >
              <Star className="w-4 h-4 fill-gold text-gold" />
              Rating & Feedback
            </button>
          </div>

          <Card variant="default" className="p-8 sm:p-10">
            {submitResult ? (
              <div className="py-12 text-center flex flex-col items-center gap-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                <h3 className="font-display text-2xl font-bold text-primary">Thank You!</h3>
                <p className="font-sans text-text-secondary text-sm max-w-md">{submitResult.message}</p>
                <Button
                  variant="gold"
                  className="mt-4"
                  onClick={() => {
                    setSubmitResult(null);
                    setFormData({ name: '', phone: '', email: '', subject: '', message: '', branchId: '' });
                    setFeedbackForm({ name: '', phone: '', rating: 5, message: '' });
                  }}
                >
                  SUBMIT ANOTHER FORM
                </Button>
              </div>
            ) : activeTab === 'INQUIRY' ? (
              /* General Inquiry Form */
              <form onSubmit={handleInquirySubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-2xl font-bold text-primary">Send Us a Message</h3>
                  <p className="font-sans text-text-muted text-xs">Fill in your details and our medical team will reach out within 24 hours.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Preferred Branch</label>
                    <select
                      value={formData.branchId}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    >
                      <option value="">Select Branch (Optional)</option>
                      {branches.map((b) => (
                        <option key={b.id || b._id} value={b.id || b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Panchakarma Treatment Enquiry"
                    className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Your Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your health concerns or questions..."
                    className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting} icon={<Send className="w-4 h-4" />}>
                  {isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}
                </Button>
              </form>
            ) : (
              /* Rating & Feedback Form */
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-2xl font-bold text-primary">Leave a Rating & Review</h3>
                  <p className="font-sans text-text-muted text-xs">Rate your treatment experience with Susrutha Ayurveda.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-sans font-bold text-primary uppercase">Your Rating Score *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= feedbackForm.rating
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="font-display text-lg font-bold text-primary ml-2">
                      {feedbackForm.rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={feedbackForm.phone}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold text-primary uppercase mb-1">Feedback & Review Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    placeholder="Share your experience regarding doctors, staff, accommodations, or therapies..."
                    className="w-full bg-surface border border-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
                  />
                </div>

                <Button type="submit" variant="gold" className="w-full" disabled={isSubmitting} icon={<Star className="w-4 h-4 fill-current" />}>
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT RATING & FEEDBACK'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
