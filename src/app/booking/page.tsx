'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, ArrowRight, Loader2, Sparkles, Building2, PackageCheck, Stethoscope, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { InfiniteSelect } from '@/components/ui/InfiniteSelect';
import { Badge } from '@/components/ui/Badge';
import {
  createAppointment,
  submitContactLead,
  fetchDoctorsList,
  fetchTreatmentsList,
  fetchCarePackages,
  fetchBranches,
  DoctorItem,
  TreatmentItem,
  CarePackageItem,
  BranchItem,
} from '@/lib/api';
import { useApiData } from '@/hooks/useApiData';
import { formatCurrency } from '@/lib/utils';

function BookingContent() {
  const searchParams = useSearchParams();

  // Mode: 'PACKAGE' or 'TREATMENT'
  const [bookingMode, setBookingMode] = useState<'PACKAGE' | 'TREATMENT'>('TREATMENT');
  const [step, setStep] = useState(1);

  // Api Data
  const { data: treatments } = useApiData<TreatmentItem[]>(fetchTreatmentsList, []);
  const { data: doctors } = useApiData<DoctorItem[]>(fetchDoctorsList, []);
  const { data: branches } = useApiData<BranchItem[]>(async () => {
    const res = await fetchBranches();
    return res.data || [];
  }, []);
  const [packages, setPackages] = useState<CarePackageItem[]>([]);

  // Selection states
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedTreatmentId, setSelectedTreatmentId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-08-05');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [patientInfo, setPatientInfo] = useState({ name: '', email: '', phone: '', symptoms: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Fetch Care Packages
  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await fetchCarePackages({ page: 1, limit: 100 });
        setPackages(res.data || []);
      } catch {
        setPackages([]);
      }
    }
    loadPackages();
  }, []);

  // Set default branch if available and none selected
  useEffect(() => {
    if (!selectedBranchId && branches.length > 0) {
      setSelectedBranchId(branches[0]._id || branches[0].id || '');
    }
  }, [branches, selectedBranchId]);

  // Parse URL Parameters & Auto-fill
  useEffect(() => {
    if (!searchParams) return;

    const pkgParam = searchParams.get('package');
    const treatParam = searchParams.get('treatment');
    const docParam = searchParams.get('doctor');
    const branchParam = searchParams.get('branch');

    if (pkgParam) {
      setBookingMode('PACKAGE');
      setSelectedPackageId(pkgParam);
      setStep(2);
    } else if (treatParam) {
      setBookingMode('TREATMENT');
      setSelectedTreatmentId(treatParam);
      setStep(2);
    }

    if (docParam) {
      const foundDoc = doctors.find(
        (d) => d._id === docParam || d.id === docParam || d.slug === docParam || d.name.toLowerCase() === docParam.toLowerCase()
      );
      if (foundDoc) {
        setSelectedDoctorId(foundDoc._id || foundDoc.id || '');
      }
    }

    if (branchParam) {
      setSelectedBranchId(branchParam);
    }
  }, [searchParams, doctors]);

  // Dynamically Filtered Packages by Selected Branch
  const filteredPackages = useMemo(() => {
    if (!selectedBranchId) return packages;
    return packages.filter((p) => {
      if (!p.assignedBranchIds || p.assignedBranchIds.length === 0) return true;
      return p.assignedBranchIds.some((b: any) => (typeof b === 'object' ? b._id === selectedBranchId : b === selectedBranchId));
    });
  }, [packages, selectedBranchId]);

  // Dynamically Filtered Treatments by Selected Branch
  const filteredTreatments = useMemo(() => {
    if (!selectedBranchId) return treatments;
    return treatments.filter((t) => {
      if (!t.assignedBranchIds || t.assignedBranchIds.length === 0) return true;
      return t.assignedBranchIds.some((b: any) => (typeof b === 'object' ? b._id === selectedBranchId : b === selectedBranchId));
    });
  }, [treatments, selectedBranchId]);

  // Dynamically Filtered Doctors by Selected Branch
  const filteredDoctors = useMemo(() => {
    if (!selectedBranchId) return doctors;
    return doctors.filter((d) => {
      if (!d.assignedBranchIds || d.assignedBranchIds.length === 0) return true;
      return d.assignedBranchIds.some((b: any) => (typeof b === 'object' ? b._id === selectedBranchId : b === selectedBranchId));
    });
  }, [doctors, selectedBranchId]);

  // Derived Active Items
  const activePackage = useMemo(() => {
    const list = filteredPackages.length > 0 ? filteredPackages : packages;
    if (!selectedPackageId && list.length > 0) return list[0];
    return list.find((p) => (p._id || p.id || p.slug) === selectedPackageId) || list[0] || null;
  }, [packages, filteredPackages, selectedPackageId]);

  const activeTreatment = useMemo(() => {
    const list = filteredTreatments.length > 0 ? filteredTreatments : treatments;
    if (!selectedTreatmentId && list.length > 0) return list[0];
    return list.find((t) => (t._id || t.id || t.slug || t.title) === selectedTreatmentId) || list[0] || null;
  }, [treatments, filteredTreatments, selectedTreatmentId]);

  const activeDoctor = useMemo(() => {
    const list = filteredDoctors.length > 0 ? filteredDoctors : doctors;
    if (!selectedDoctorId) return list[0] || null;
    return list.find((d) => (d._id || d.id || d.name) === selectedDoctorId) || list[0] || null;
  }, [doctors, filteredDoctors, selectedDoctorId]);

  const activeBranch = useMemo(() => {
    return branches.find((b) => (b._id || b.id) === selectedBranchId) || branches[0] || null;
  }, [branches, selectedBranchId]);

  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isPackageMode = bookingMode === 'PACKAGE';
    const chosenTitle = isPackageMode
      ? activePackage?.title || 'Care Package'
      : activeTreatment?.title || activeTreatment?.name || 'Ayurvedic Therapy';

    const payload = {
      name: patientInfo.name,
      phone: patientInfo.phone,
      email: patientInfo.email,
      date: selectedDate,
      preferredTimeSlot: selectedTime,
      doctorId: activeDoctor?._id || activeDoctor?.id,
      branchId: selectedBranchId || (activeDoctor?.assignedBranchIds?.[0] as any)?._id || undefined,
      symptoms: `[${bookingMode}] ${chosenTitle} — ${patientInfo.symptoms || 'No additional notes'}`,
    };

    // 1. Create Appointment
    const res = await createAppointment(payload);

    // 2. Submit Classified Lead
    await submitContactLead({
      name: patientInfo.name,
      phone: patientInfo.phone,
      email: patientInfo.email,
      subject: isPackageMode ? `Package Reservation: ${chosenTitle}` : `Single Treatment Booking: ${chosenTitle}`,
      message: `Branch: ${activeBranch?.name || 'Primary Branch'} | Preferred Date: ${selectedDate} | Time Slot: ${selectedTime} | ${patientInfo.symptoms || ''}`,
      leadType: isPackageMode ? 'PACKAGE_BOOKING' : 'SINGLE_TREATMENT',
      packageId: isPackageMode ? activePackage?._id || activePackage?.id : undefined,
      treatmentId: !isPackageMode ? activeTreatment?._id || activeTreatment?.id : undefined,
      doctorId: activeDoctor?._id || activeDoctor?.id,
      branchId: selectedBranchId || undefined,
      preferredDate: selectedDate,
      preferredTimeSlot: selectedTime,
      symptomsNote: patientInfo.symptoms,
    });

    setIsSubmitting(false);
    setBookingResult(res?.data || { appointmentNumber: `SUS-${Date.now().toString().slice(-6)}` });
  };

  if (bookingResult) {
    const isPkg = bookingMode === 'PACKAGE';
    const itemTitle = isPkg ? activePackage?.title : activeTreatment?.title || activeTreatment?.name;

    return (
      <div className="px-6 sm:px-12 max-w-2xl mx-auto py-24 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <Badge variant="gold" className="mb-4">RESERVATION CONFIRMED</Badge>
        <h1 className="font-display text-4xl font-bold text-primary mb-4">
          Your Journey Has Begun
        </h1>
        <p className="font-sans text-text-secondary text-sm mb-8 leading-relaxed">
          We have recorded your reservation in our clinical database for <strong className="text-primary">{itemTitle}</strong> at <strong className="text-primary">{activeBranch?.name || 'Hospital Branch'}</strong> on <strong className="text-primary">{selectedDate} at {selectedTime}</strong> with <strong className="text-primary">{activeDoctor?.name || 'Senior Physician'}</strong>.
        </p>
        <Card variant="glass" className="w-full text-left p-6 mb-8 border-gold/30">
          <div className="text-xs font-sans space-y-2">
            <div className="flex justify-between">
              <span className="text-text-muted">Booking Reference:</span>
              <span className="font-bold text-primary">{bookingResult.appointmentNumber || 'SUS-2026-8841'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Hospital Branch:</span>
              <span className="font-bold text-primary">{activeBranch?.name || 'Default Branch'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Booking Type:</span>
              <span className="font-bold text-gold-dark">{isPkg ? 'CARE PACKAGE' : 'SINGLE THERAPY'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Selected Item:</span>
              <span className="font-bold text-primary">{itemTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Attending Consultant:</span>
              <span className="font-bold text-primary">{activeDoctor?.name || 'Senior Physician'}</span>
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
    <div className="px-6 sm:px-12 md:px-20 max-w-4xl mx-auto flex flex-col gap-8 pt-32 pb-24">
      {/* Page Header */}
      <div className="text-center">
        <Badge variant="gold" className="mb-3 px-4 py-1" icon={<Sparkles className="w-3.5 h-3.5" />}>
          ONLINE RESERVATION WIZARD
        </Badge>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-primary mb-3">
          Reserve Your Care & Consultation
        </h1>
        <p className="font-sans text-text-secondary text-sm sm:text-base max-w-xl mx-auto">
          Select your hospital branch, choose between full Care Packages or Single Therapies, and pick your physician.
        </p>
      </div>

      {/* Primary Branch Location Selector Bar */}
      {branches.length > 0 && (
        <Card variant="glass" className="p-4 sm:p-6 border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 text-gold-dark flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted block">
                SELECT HOSPITAL BRANCH
              </span>
              <span className="font-display text-lg font-bold text-primary">
                {activeBranch?.name || 'All Branches'}
              </span>
            </div>
          </div>

          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-primary/20 bg-background text-sm font-sans font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {branches.map((b) => (
              <option key={b._id || b.id} value={b._id || b.id}>
                {b.name} ({b.code || 'BRANCH'})
              </option>
            ))}
          </select>
        </Card>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="p-1.5 rounded-2xl bg-surface-elevated border border-primary/15 flex gap-2 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setBookingMode('TREATMENT');
              if (filteredTreatments.length > 0) {
                setSelectedTreatmentId(filteredTreatments[0]._id || filteredTreatments[0].id || '');
              }
            }}
            className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              bookingMode === 'TREATMENT'
                ? 'bg-primary text-gold shadow-md'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Single Treatment
          </button>
          <button
            type="button"
            onClick={() => {
              setBookingMode('PACKAGE');
              if (filteredPackages.length > 0) {
                setSelectedPackageId(filteredPackages[0]._id || filteredPackages[0].id || '');
              }
            }}
            className={`px-5 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              bookingMode === 'PACKAGE'
                ? 'bg-primary text-gold shadow-md'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            Care Package
          </button>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="flex justify-center items-center gap-3 text-xs font-sans font-bold uppercase tracking-widest">
        <span className={`px-4 py-2 rounded-full transition-colors ${step >= 1 ? 'bg-primary text-gold' : 'bg-surface-elevated text-text-muted'}`}>
          1. Select {bookingMode === 'PACKAGE' ? 'Package' : 'Therapy'}
        </span>
        <span className="text-text-muted">•</span>
        <span className={`px-4 py-2 rounded-full transition-colors ${step >= 2 ? 'bg-primary text-gold' : 'bg-surface-elevated text-text-muted'}`}>
          2. Doctor & Date
        </span>
        <span className="text-text-muted">•</span>
        <span className={`px-4 py-2 rounded-full transition-colors ${step >= 3 ? 'bg-primary text-gold' : 'bg-surface-elevated text-text-muted'}`}>
          3. Patient Details
        </span>
      </div>

      {/* Card Content */}
      <Card variant="default" className="p-6 sm:p-10 border-gold/30 shadow-xl bg-surface-card">
        {/* STEP 1: SELECT PACKAGE OR TREATMENT */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-primary">
                Choose {bookingMode === 'PACKAGE' ? 'Care Package' : 'Treatment Therapy'}
              </h3>
              {activeBranch && (
                <span className="text-xs font-sans text-gold-dark font-semibold">
                  Showing available items at {activeBranch.name}
                </span>
              )}
            </div>

            {bookingMode === 'PACKAGE' ? (
              /* Package Selection List */
              <div className="grid grid-cols-1 gap-4">
                {(filteredPackages.length > 0 ? filteredPackages : packages).length === 0 ? (
                  <div className="text-center py-8 text-sm text-text-muted">No packages found for this branch.</div>
                ) : (
                  (filteredPackages.length > 0 ? filteredPackages : packages).map((pkg) => {
                    const id = pkg._id || pkg.id || pkg.slug;
                    const isSelected = selectedPackageId ? selectedPackageId === id : activePackage?._id === id;

                    return (
                      <div
                        key={id}
                        onClick={() => setSelectedPackageId(id || '')}
                        className={`p-5 rounded-2xl border cursor-pointer flex justify-between items-start transition-all ${
                          isSelected
                            ? 'border-gold bg-primary/5 ring-1 ring-gold shadow-glow-gold'
                            : 'border-primary/10 hover:border-gold/50'
                        }`}
                      >
                        <div className="space-y-1 max-w-lg">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold-dark text-[10px] font-bold uppercase font-mono">
                              {pkg.durationDays || 7} Days
                            </span>
                            <h4 className="font-display text-xl font-bold text-primary">{pkg.title}</h4>
                          </div>
                          {pkg.subtitle && (
                            <p className="text-xs font-sans text-text-secondary">{pkg.subtitle}</p>
                          )}
                          {Array.isArray(pkg.inclusions) && pkg.inclusions.length > 0 && (
                            <div className="text-[11px] font-sans text-text-muted pt-1">
                              Includes: {pkg.inclusions.slice(0, 3).join(' • ')}
                            </div>
                          )}
                        </div>
                        <span className="font-display text-xl font-bold text-primary shrink-0">
                          {formatCurrency(pkg.price || 15000)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Single Treatment Selection List */
              <div className="grid grid-cols-1 gap-4">
                {(filteredTreatments.length > 0 ? filteredTreatments : treatments).map((t, idx) => {
                  const id = t._id || t.id || t.title || `t-${idx}`;
                  const title = t.title || t.name || 'Ayurvedic Therapy';
                  const isSelected = selectedTreatmentId ? selectedTreatmentId === id : idx === 0;

                  return (
                    <div
                      key={id}
                      onClick={() => setSelectedTreatmentId(id)}
                      className={`p-5 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                        isSelected
                          ? 'border-gold bg-primary/5 ring-1 ring-gold shadow-glow-gold'
                          : 'border-primary/10 hover:border-gold/50'
                      }`}
                    >
                      <div>
                        <h4 className="font-display text-xl font-bold text-primary">{title}</h4>
                        <span className="text-xs font-sans text-text-secondary">
                          {t.duration || '60 Mins'} • {t.category || 'Vedic Therapy'}
                        </span>
                      </div>
                      <span className="font-display text-xl font-bold text-primary">
                        {formatCurrency(t.price || 3500)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <Button
              variant="gold"
              className="ml-auto"
              onClick={() => setStep(2)}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              CONTINUE TO DOCTOR & TIME
            </Button>
          </div>
        )}

        {/* STEP 2: SELECT DOCTOR & TIME */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <h3 className="font-display text-2xl font-bold text-primary">Select Doctor & Preferred Date</h3>

            {/* Doctor Selector */}
            <InfiniteSelect
              label={`ATTENDING PHYSICIAN (${filteredDoctors.length} Available at ${activeBranch?.name || 'Branch'})`}
              placeholder="Search & select physician..."
              options={(filteredDoctors.length > 0 ? filteredDoctors : doctors).map((d, idx) => {
                const id = d._id || d.id || d.name || `d-${idx}`;
                return {
                  label: d.name,
                  value: id,
                  sublabel: d.specialization || d.designation || 'Consultant Physician',
                };
              })}
              value={selectedDoctorId || (activeDoctor?._id || activeDoctor?.id || '')}
              onChange={(val) => setSelectedDoctorId(val)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="PREFERRED DATE"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Select
                label="PREFERRED TIME SLOT"
                options={[
                  { label: '09:00 AM', value: '09:00 AM' },
                  { label: '10:30 AM', value: '10:30 AM' },
                  { label: '02:00 PM', value: '02:00 PM' },
                  { label: '04:30 PM', value: '04:30 PM' },
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

        {/* STEP 3: PATIENT INFO & CONFIRMATION */}
        {step === 3 && (
          <form onSubmit={handleCompleteBooking} className="flex flex-col gap-6">
            <h3 className="font-display text-2xl font-bold text-primary">Patient Details & Final Summary</h3>

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
              placeholder="Brief description of health goals or symptoms..."
              value={patientInfo.symptoms}
              onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
            />

            {/* Summary Box */}
            <div className="p-5 rounded-2xl bg-surface-elevated border border-primary/10 text-xs font-sans space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Hospital Location:</span>
                <span className="font-bold text-primary">{activeBranch?.name || 'Primary Branch'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Booking Category:</span>
                <span className="font-bold text-gold-dark">{bookingMode === 'PACKAGE' ? 'CARE PACKAGE' : 'SINGLE THERAPY'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Selected Item:</span>
                <span className="font-bold text-primary">
                  {bookingMode === 'PACKAGE' ? activePackage?.title : activeTreatment?.title || activeTreatment?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Attending Doctor:</span>
                <span className="font-bold text-primary">{activeDoctor?.name || 'Consultant Physician'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Reservation Slot:</span>
                <span className="font-bold text-primary">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between border-t border-primary/10 pt-2 font-bold text-sm">
                <span className="text-primary">Estimated Investment:</span>
                <span className="text-gold-dark font-display text-base">
                  {formatCurrency(bookingMode === 'PACKAGE' ? activePackage?.price || 15000 : activeTreatment?.price || 3500)}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                BACK
              </Button>
              <Button
                type="submit"
                variant="gold"
                disabled={isSubmitting}
                icon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              >
                {isSubmitting ? 'PROCESSING...' : 'CONFIRM & RESERVE'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
