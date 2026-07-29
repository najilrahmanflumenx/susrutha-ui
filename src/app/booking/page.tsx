'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { createAppointment, fetchDoctors, fetchTreatments, MOCK_DOCTORS, MOCK_TREATMENTS, DoctorItem, TreatmentItem } from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { formatCurrency } from '@/lib/utils';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const { data: treatments } = useApiData<TreatmentItem[]>(fetchTreatments, MOCK_TREATMENTS);
  const { data: doctors } = useApiData<DoctorItem[]>(fetchDoctors, MOCK_DOCTORS);

  const [selectedTreatmentId, setSelectedTreatmentId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-05');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [patientInfo, setPatientInfo] = useState({ name: '', email: '', phone: '', symptoms: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const activeTreatment = treatments.find((t) => (t.id || t._id || t.title) === selectedTreatmentId) || treatments[0] || MOCK_TREATMENTS[0];
  const activeDoctor = doctors.find((d) => (d.id || d._id || d.name) === selectedDoctorId) || doctors[0] || MOCK_DOCTORS[0];

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const branchId = activeDoctor?.assignedBranchIds && activeDoctor.assignedBranchIds.length > 0
      ? (typeof activeDoctor.assignedBranchIds[0] === 'object' ? (activeDoctor.assignedBranchIds[0] as any)._id : activeDoctor.assignedBranchIds[0])
      : undefined;

    const res = await createAppointment({
      name: patientInfo.name,
      phone: patientInfo.phone,
      email: patientInfo.email,
      date: selectedDate,
      preferredTimeSlot: selectedTime,
      doctorId: activeDoctor?._id || activeDoctor?.id,
      branchId,
      symptoms: `${activeTreatment?.title || activeTreatment?.name} - ${patientInfo.symptoms}`
    });

    setIsSubmitting(false);
    setBookingResult(res?.data || { appointmentNumber: `APT-${Date.now().toString().slice(-6)}` });
  };

  if (bookingResult) {
    return (
      <div className="px-6 sm:px-12 max-w-2xl mx-auto py-16 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <Badge variant="gold" className="mb-4">RESERVATION CONFIRMED</Badge>
        <h1 className="font-display text-4xl font-bold text-primary mb-4">
          Your Journey Has Begun
        </h1>
        <p className="font-sans text-text-secondary text-sm mb-8 leading-relaxed">
          We have recorded your appointment in our clinical system for <strong className="text-primary">{activeTreatment.title || activeTreatment.name}</strong> on <strong className="text-primary">{selectedDate} at {selectedTime}</strong> with <strong className="text-primary">{activeDoctor.name}</strong>.
        </p>
        <Card variant="glass" className="w-full text-left p-6 mb-8 border-gold/30">
          <div className="text-xs font-sans space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Appointment Ref #:</span>
              <span className="font-bold text-primary">{bookingResult.appointmentNumber || 'SUS-2026-8841'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Attending Consultant:</span>
              <span className="font-bold text-primary">{activeDoctor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Therapy Ritual:</span>
              <span className="font-bold text-primary">{activeTreatment.title || activeTreatment.name}</span>
            </div>
          </div>
        </Card>
        <Button variant="gold" onClick={() => (window.location.href = '/')}>
          RETURN TO HOME
        </Button>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-4xl mx-auto flex flex-col gap-10 pb-24">
      <div className="text-center pt-8">
        <Badge variant="gold" className="mb-4">ONLINE RESERVATION WIZARD</Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-primary mb-4">
          Reserve Your Consultation
        </h1>
        <p className="font-sans text-text-secondary text-sm max-w-xl mx-auto">
          Select your preferred Ayurvedic therapy, attending senior physician, and time slot below.
        </p>
      </div>

      <div className="flex justify-center items-center gap-4 text-xs font-sans font-bold uppercase tracking-widest">
        <span className={`px-4 py-2 rounded-full ${step >= 1 ? 'bg-primary text-gold' : 'bg-surface-elevated text-text-muted'}`}>
          1. Select Ritual
        </span>
        <span className="text-text-muted">•</span>
        <span className={`px-4 py-2 rounded-full ${step >= 2 ? 'bg-primary text-gold' : 'bg-surface-elevated text-text-muted'}`}>
          2. Doctor & Time
        </span>
        <span className="text-text-muted">•</span>
        <span className={`px-4 py-2 rounded-full ${step >= 3 ? 'bg-primary text-gold' : 'bg-surface-elevated text-text-muted'}`}>
          3. Patient Info
        </span>
      </div>

      <Card variant="default" className="p-8 border-gold/30">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-2xl font-bold text-primary">Choose Treatment Ritual</h3>
            <div className="grid grid-cols-1 gap-4">
              {treatments.map((t, idx) => {
                const id = t.id || t._id || t.title || `t-${idx}`;
                const title = t.title || t.name || 'Ayurvedic Therapy';
                const isSelected = selectedTreatmentId ? selectedTreatmentId === id : idx === 0;

                return (
                  <div
                    key={id}
                    onClick={() => setSelectedTreatmentId(id)}
                    className={`p-5 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                      isSelected
                        ? 'border-gold bg-primary/5 shadow-glow-gold'
                        : 'border-primary/10 hover:border-gold/50'
                    }`}
                  >
                    <div>
                      <h4 className="font-display text-xl font-bold text-primary">{title}</h4>
                      <span className="text-xs font-sans text-text-secondary">{t.duration || '60 Mins'} • {t.dosha || t.category || 'Vedic Care'}</span>
                    </div>
                    <span className="font-display text-lg font-bold text-primary">{formatCurrency(t.price || 3500)}</span>
                  </div>
                );
              })}
            </div>
            <Button variant="gold" className="ml-auto" onClick={() => setStep(2)} icon={<ArrowRight className="w-4 h-4" />}>
              CONTINUE TO DOCTOR & TIME
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-2xl font-bold text-primary">Select Doctor & Time Slot</h3>
            <Select
              label="ATTENDING PHYSICIAN"
              options={doctors.map((d, idx) => {
                const id = d.id || d._id || d.name || `d-${idx}`;
                return { label: `${d.name} (${d.specialization || d.designation || 'Consultant'})`, value: id };
              })}
              value={selectedDoctorId || (doctors[0]?.id || doctors[0]?._id || '')}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="PREFERRED DATE"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Select
                label="TIME SLOT"
                options={[
                  { label: '09:00 AM', value: '09:00 AM' },
                  { label: '10:30 AM', value: '10:30 AM' },
                  { label: '02:00 PM', value: '02:00 PM' },
                  { label: '04:30 PM', value: '04:30 PM' }
                ]}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(1)}>
                BACK
              </Button>
              <Button variant="gold" onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />}>
                CONTINUE TO PATIENT DETAILS
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleCompleteBooking} className="flex flex-col gap-6">
            <h3 className="font-display text-2xl font-bold text-primary">Patient Details</h3>
            <Input
              label="FULL NAME"
              placeholder="e.g. Ananya Sharma"
              required
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="EMAIL ADDRESS"
                type="email"
                placeholder="ananya@example.com"
                value={patientInfo.email}
                onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
              />
              <Input
                label="PHONE NUMBER"
                type="tel"
                placeholder="+91 98765 43210"
                required
                value={patientInfo.phone}
                onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
              />
            </div>
            <Input
              label="HEALTH CONCERNS / SYMPTOMS (OPTIONAL)"
              placeholder="Brief description of symptoms or health goals"
              value={patientInfo.symptoms}
              onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
            />

            <div className="p-4 rounded-2xl bg-surface-elevated border border-primary/10 text-xs font-sans space-y-1">
              <div className="flex justify-between">
                <span className="text-text-muted">Therapy Ritual:</span>
                <span className="font-bold text-primary">{activeTreatment.title || activeTreatment.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Attending Doctor:</span>
                <span className="font-bold text-primary">{activeDoctor.name}</span>
              </div>
              <div className="flex justify-between border-t border-primary/10 pt-2 font-bold">
                <span className="text-primary">Total Investment:</span>
                <span className="text-gold-dark">{formatCurrency(activeTreatment.price || 3500)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                BACK
              </Button>
              <Button type="submit" variant="gold" disabled={isSubmitting} icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}>
                {isSubmitting ? 'PROCESSING...' : 'CONFIRM & RESERVE'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
