'use client';

import { FormEvent, useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CalendarHeart,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareHeart,
  Package,
  Phone,
  Star,
} from 'lucide-react';
import { brand, branches } from '../data/site';
import { doctors } from '../data/doctors';
import { specialties } from '../data/specialties';
import { packages } from '../data/packages';
import { Button, FieldError, inputClass, Label } from './ui';
import { cn } from '../lib/utils';
import { bookAppointment, submitLead, submitFeedback as submitFeedbackApi, getDoctors, getConditions, getPackages, getBranches } from '../lib/api';

type Tab = 'appointment' | 'package' | 'contact' | 'feedback';

const tabs: { id: Tab; label: string; icon: typeof CalendarHeart }[] = [
  { id: 'appointment', label: 'Book Appointment', icon: CalendarHeart },
  { id: 'package', label: 'Package Enquiry', icon: Package },
  { id: 'contact', label: 'Contact Us', icon: Mail },
  { id: 'feedback', label: 'Feedback', icon: MessageSquareHeart },
];

function AppointmentHubContent({ defaultTab = 'appointment' as Tab }: { defaultTab?: Tab }) {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [done, setDone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [availableDoctors, setAvailableDoctors] = useState<any[]>(
    doctors.map((d) => ({ id: d.id, slug: d.slug, name: d.name }))
  );
  const [availableSpecialties, setAvailableSpecialties] = useState<any[]>(
    specialties.map((s) => ({ id: s.id, name: s.name }))
  );
  const [availablePackages, setAvailablePackages] = useState<any[]>(
    packages.map((p) => ({ id: p.id, slug: p.slug, name: p.name }))
  );
  const [availableBranches, setAvailableBranches] = useState<any[]>(
    branches.map((b) => ({
      _id: b.id,
      id: b.id,
      code: b.code,
      name: b.name,
      slug: b.slug,
      type: b.type,
      city: b.city,
      address: b.address,
      description: b.description,
      features: b.features,
      opdTimings: b.hours.op,
      contact: { phone: ['+91 96566 56736'], email: 'info@susruthaayurveda.com' },
    }))
  );

  const [appt, setAppt] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'KTK',
    doctor: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });
  const [pkg, setPkg] = useState({
    name: '',
    phone: '',
    packageId: '',
    dates: '',
    people: '1',
    international: 'no',
    message: '',
  });
  const [contact, setContact] = useState({ name: '', phone: '', email: '', message: '' });
  const [feedback, setFeedback] = useState({ name: '', phone: '', rating: '5', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([getDoctors(), getConditions(), getPackages(), getBranches()]).then(([docs, conds, pkgs, brs]) => {
      if (docs && Array.isArray(docs) && docs.length > 0) {
        setAvailableDoctors(docs.map((d: any) => ({ id: d._id || d.slug || d.id, slug: d.slug, name: d.name })));
      }
      if (conds && Array.isArray(conds) && conds.length > 0) {
        setAvailableSpecialties(conds.map((c: any) => ({ id: c._id || c.slug || c.id, name: c.title || c.name })));
      }
      if (pkgs && Array.isArray(pkgs) && pkgs.length > 0) {
        setAvailablePackages(pkgs.map((p: any) => ({ id: p._id || p.slug || p.id, slug: p.slug, name: p.title || p.name })));
      }
      if (brs && Array.isArray(brs) && brs.length > 0) {
        setAvailableBranches(brs);
        setAppt((a) => ({ ...a, branch: a.branch === 'KATT' || a.branch === 'KTK' ? (brs[0].code || 'KTK') : a.branch }));
      }
    });
  }, []);

  useEffect(() => {
    if (!searchParams) return;
    const t = searchParams.get('tab') as Tab | null;
    if (t && tabs.some((x) => x.id === t)) setTab(t);
    const docSlug = searchParams.get('doctor');
    if (docSlug && availableDoctors.length > 0) {
      const d = availableDoctors.find((x) => x.slug === docSlug);
      if (d) setAppt((a) => ({ ...a, doctor: d.id }));
    }
    const packageSlug = searchParams.get('package');
    if (packageSlug && availablePackages.length > 0) {
      const p = availablePackages.find((x) => x.slug === packageSlug);
      if (p) {
        setTab('package');
        setPkg((x) => ({ ...x, packageId: p.id }));
      }
    }
  }, [searchParams, availableDoctors, availablePackages]);

  async function submitAppointment(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!appt.name.trim()) err.name = 'Please enter your full name.';
    if (!/^[\d\s+]{8,15}$/.test(appt.phone.trim())) err.phone = 'Enter a valid phone number.';
    if (appt.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appt.email)) err.email = 'Enter a valid email or leave blank.';
    if (!appt.service) err.service = 'Select a specialty/service.';
    if (!appt.date) err.date = 'Choose a preferred date.';
    if (!appt.time) err.time = 'Choose a preferred time.';
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await bookAppointment({
        patientName: appt.name,
        patientPhone: appt.phone,
        patientEmail: appt.email,
        preferredBranchCode: appt.branch,
        preferredDoctorId: appt.doctor || undefined,
        preferredDate: appt.date,
        timeSlot: appt.time,
        symptomsNote: `${appt.service ? 'Service: ' + appt.service + '. ' : ''}${appt.message}`,
      });
    } catch {
      // Fallback local storage
      try {
        const prev = JSON.parse(localStorage.getItem('susrutha_appointments') || '[]');
        prev.push({ ...appt, at: new Date().toISOString() });
        localStorage.setItem('susrutha_appointments', JSON.stringify(prev));
      } catch {}
    } finally {
      setLoading(false);
      setDone('appointment');
    }
  }

  async function submitPackage(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!pkg.name.trim()) err.pname = 'Name is required.';
    if (!/^[\d\s+]{8,15}$/.test(pkg.phone.trim())) err.pphone = 'Valid phone required.';
    if (!pkg.packageId) err.packageId = 'Select a package.';
    if (!pkg.dates.trim()) err.dates = 'Share preferred dates.';
    setErrors(err);
    if (Object.keys(err).length) return;

    const targetPkg = availablePackages.find(p => p.id === pkg.packageId || p.slug === pkg.packageId || p.name === pkg.packageId);
    const packageName = targetPkg ? targetPkg.name : pkg.packageId;

    setLoading(true);
    try {
      await submitLead({
        name: pkg.name,
        phone: pkg.phone,
        subject: `Package Enquiry: ${packageName}`,
        message: `Package: ${packageName}, Dates: ${pkg.dates}, People: ${pkg.people}, Intl: ${pkg.international}. Note: ${pkg.message}`,
      });
    } catch {
      try {
        const prev = JSON.parse(localStorage.getItem('susrutha_enquiries') || '[]');
        prev.push({ ...pkg, packageName, at: new Date().toISOString() });
        localStorage.setItem('susrutha_enquiries', JSON.stringify(prev));
      } catch {}
    } finally {
      setLoading(false);
      setDone('package');
    }
  }

  async function submitContact(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!contact.name.trim()) err.cname = 'Name required';
    if (!contact.phone.trim()) err.cphone = 'Phone required';
    if (!contact.message.trim()) err.cmessage = 'Message required';
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await submitLead({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        subject: 'General Contact',
        message: contact.message,
      });
    } catch {
      try {
        const prev = JSON.parse(localStorage.getItem('susrutha_contact') || '[]');
        prev.push({ ...contact, at: new Date().toISOString() });
        localStorage.setItem('susrutha_contact', JSON.stringify(prev));
      } catch {}
    } finally {
      setLoading(false);
      setDone('contact');
    }
  }

  async function submitFeedback(e: FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!feedback.name.trim()) err.fname = 'Name required';
    if (!feedback.message.trim()) err.fmessage = 'Feedback required';
    setErrors(err);
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await submitFeedbackApi({
        name: feedback.name,
        phone: feedback.phone || 'N/A',
        rating: feedback.rating,
        message: feedback.message,
      });
    } catch {
      try {
        const prev = JSON.parse(localStorage.getItem('susrutha_feedback') || '[]');
        prev.push({ ...feedback, at: new Date().toISOString() });
        localStorage.setItem('susrutha_feedback', JSON.stringify(prev));
      } catch {}
    } finally {
      setLoading(false);
      setDone('feedback');
    }
  }

  if (done) {
    const copy =
      done === 'appointment'
        ? 'Your appointment request has been recorded for confirmation against doctor availability.'
        : done === 'package'
          ? 'Your package enquiry is with our care coordination team.'
          : done === 'contact'
            ? 'Your message has been received. We will respond using your phone or email.'
            : 'Thank you for your feedback. It is queued for internal review.';
    return (
      <div className="rounded-[1.5rem] border border-ochre/40 bg-[#1C1214]/95 p-8 text-center shadow-glass-dark text-ivory-50">
        <h3 className="font-display text-3xl text-white">Request received</h3>
        <p className="mt-3 text-ivory-200/90 max-w-lg mx-auto">{copy}</p>
        <p className="mt-4 text-sm text-ivory-300/80">
          Call {brand.contact.mobile} · Emergency {brand.contact.emergency[0]}
        </p>
        <Button
          className="mt-6"
          onClick={() => {
            setDone(null);
            setErrors({});
          }}
        >
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 xl:grid-cols-12 font-body text-ivory-50">
      <div className="xl:col-span-7 space-y-5">
        <div className="flex flex-wrap gap-2 rounded-2xl border border-ochre/30 bg-[#1C1214]/90 p-2 shadow-glass-dark">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setErrors({});
                }}
                className={cn(
                  'inline-flex flex-1 min-w-[9rem] items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300',
                  active
                    ? 'bg-gradient-to-r from-crimson via-[#9F0311] to-crimson-700 text-white border border-[#FFC86B]/40 shadow-soft-md'
                    : 'text-ivory-200/90 border border-transparent hover:bg-white/10 hover:text-[#FFC86B]',
                )}
              >
                <Icon className="h-4 w-4 text-[#FFC86B]" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-[1.5rem] border border-ochre/30 bg-[#1C1214]/95 p-6 sm:p-8 shadow-glass-dark">
          {tab === 'appointment' && (
            <form onSubmit={submitAppointment} className="space-y-5" noValidate>
              <div>
                <h2 className="font-display text-2xl text-white">Book Appointment</h2>
                <p className="mt-1 text-sm text-ivory-200/90">Requests are confirmed against live roster before you travel.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="full-name">Full Name</Label>
                  <input id="full-name" className={inputClass} value={appt.name} onChange={(e) => setAppt({ ...appt, name: e.target.value })} autoComplete="name" />
                  <FieldError message={errors.name} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <input id="phone" className={inputClass} value={appt.phone} onChange={(e) => setAppt({ ...appt, phone: e.target.value })} autoComplete="tel" />
                  <FieldError message={errors.phone} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <input id="email" type="email" className={inputClass} value={appt.email} onChange={(e) => setAppt({ ...appt, email: e.target.value })} />
                <FieldError message={errors.email} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <select id="branch" className={inputClass} value={appt.branch} onChange={(e) => setAppt({ ...appt, branch: e.target.value, doctor: '' })}>
                    {availableBranches.map((b: any) => (
                      <option key={b._id || b.id} value={b.code || b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor (Optional)</Label>
                  <select id="doctor" className={inputClass} value={appt.doctor} onChange={(e) => setAppt({ ...appt, doctor: e.target.value })}>
                    <option value="">First available / advise me</option>
                    {availableDoctors.map((d: any) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="service">Specialty / Service</Label>
                <select id="service" className={inputClass} value={appt.service} onChange={(e) => setAppt({ ...appt, service: e.target.value })}>
                  <option value="">Select…</option>
                  {availableSpecialties.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                  <option value="general-consult">General consultation</option>
                  <option value="package-planning">Package planning</option>
                </select>
                <FieldError message={errors.service} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="date">Preferred Date</Label>
                  <input id="date" type="date" className={inputClass} value={appt.date} onChange={(e) => setAppt({ ...appt, date: e.target.value })} />
                  <FieldError message={errors.date} />
                </div>
                <div>
                  <Label htmlFor="time">Preferred Time</Label>
                  <select id="time" className={inputClass} value={appt.time} onChange={(e) => setAppt({ ...appt, time: e.target.value })}>
                    <option value="">Select…</option>
                    <option>09:00 AM</option>
                    <option>11:00 AM</option>
                    <option>02:00 PM</option>
                    <option>04:00 PM</option>
                  </select>
                  <FieldError message={errors.time} />
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea id="message" rows={4} className={inputClass} value={appt.message} onChange={(e) => setAppt({ ...appt, message: e.target.value })} placeholder="Symptoms, reports, travel plans…" />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Request Appointment'}
              </Button>
            </form>
          )}

          {tab === 'package' && (
            <form onSubmit={submitPackage} className="space-y-5" noValidate>
              <div>
                <h2 className="font-display text-2xl text-white">Package Enquiry</h2>
                <p className="mt-1 text-sm text-ivory-200/90">All twelve programmes — tariffs confirmed after clinical review.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="pname">Full Name</Label>
                  <input id="pname" className={inputClass} value={pkg.name} onChange={(e) => setPkg({ ...pkg, name: e.target.value })} />
                  <FieldError message={errors.pname} />
                </div>
                <div>
                  <Label htmlFor="pphone">Phone</Label>
                  <input id="pphone" className={inputClass} value={pkg.phone} onChange={(e) => setPkg({ ...pkg, phone: e.target.value })} />
                  <FieldError message={errors.pphone} />
                </div>
              </div>
              <div>
                <Label htmlFor="packageId">Package</Label>
                <select id="packageId" className={inputClass} value={pkg.packageId} onChange={(e) => setPkg({ ...pkg, packageId: e.target.value })}>
                  <option value="">Select package…</option>
                  {availablePackages.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <FieldError message={errors.packageId} />
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="dates">Preferred dates</Label>
                  <input id="dates" className={inputClass} value={pkg.dates} onChange={(e) => setPkg({ ...pkg, dates: e.target.value })} placeholder="e.g. 12–20 Aug" />
                  <FieldError message={errors.dates} />
                </div>
                <div>
                  <Label htmlFor="people">No. of people</Label>
                  <input id="people" type="number" min={1} max={12} className={inputClass} value={pkg.people} onChange={(e) => setPkg({ ...pkg, people: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="intl">International patient?</Label>
                <select id="intl" className={inputClass} value={pkg.international} onChange={(e) => setPkg({ ...pkg, international: e.target.value })}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <Label htmlFor="pmsg">Message</Label>
                <textarea id="pmsg" rows={4} className={inputClass} value={pkg.message} onChange={(e) => setPkg({ ...pkg, message: e.target.value })} />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Send Package Enquiry'}
              </Button>
            </form>
          )}

          {tab === 'contact' && (
            <form onSubmit={submitContact} className="space-y-5" noValidate>
              <div>
                <h2 className="font-display text-2xl text-white">Contact Us</h2>
                <p className="mt-1 text-sm text-ivory-200/90">General questions, coordination and media notes.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="cname">Full Name</Label>
                  <input id="cname" className={inputClass} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  <FieldError message={errors.cname} />
                </div>
                <div>
                  <Label htmlFor="cphone">Phone</Label>
                  <input id="cphone" className={inputClass} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                  <FieldError message={errors.cphone} />
                </div>
              </div>
              <div>
                <Label htmlFor="cemail">Email (Optional)</Label>
                <input id="cemail" type="email" className={inputClass} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="cmsg">Message</Label>
                <textarea id="cmsg" rows={5} className={inputClass} value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />
                <FieldError message={errors.cmessage} />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Send Message'}
              </Button>
            </form>
          )}

          {tab === 'feedback' && (
            <form onSubmit={submitFeedback} className="space-y-5" noValidate>
              <div>
                <h2 className="font-display text-2xl text-white">Feedback</h2>
                <p className="mt-1 text-sm text-ivory-200/90">Help us improve hospital experience. Not published automatically.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="fname">Full Name</Label>
                  <input id="fname" className={inputClass} value={feedback.name} onChange={(e) => setFeedback({ ...feedback, name: e.target.value })} />
                  <FieldError message={errors.fname} />
                </div>
                <div>
                  <Label htmlFor="fphone">Phone (Optional)</Label>
                  <input id="fphone" className={inputClass} value={feedback.phone} onChange={(e) => setFeedback({ ...feedback, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="rating">Experience rating</Label>
                <select id="rating" className={inputClass} value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: e.target.value })}>
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} / 5</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="fmsg">Your feedback</Label>
                <textarea id="fmsg" rows={5} className={inputClass} value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })} />
                <FieldError message={errors.fmessage} />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          )}
        </div>
      </div>

      <aside className="xl:col-span-5 space-y-5">
        <h3 className="font-display text-2xl text-white">Branches & quick actions</h3>
        {availableBranches.map((b: any) => {
          const addressStr = typeof b.address === 'string'
            ? b.address
            : b.address
              ? [b.address.street, b.address.city, b.address.state, b.address.pincode].filter(Boolean).join(', ')
              : '';

          const phone = b.contact?.phone?.[0] ?? b.contact?.phone ?? brand.contact.mobileTel;
          const phoneDisplay = b.contact?.phone?.[0] ?? brand.contact.mobile;
          const email = b.contact?.email ?? brand.contact.email;

          const opTiming = b.opdTimings ?? (b.hours && 'op' in b.hours ? b.hours.op : brand.hours.op);
          const hospitalTiming = b.hours && 'hospital' in b.hours
            ? b.hours.hospital
            : (b.isMainBranch || b.id === 'kattakada')
              ? brand.hours.hospital
              : 'OP centre — see doctor schedule';

          const mapQuery = b.mapQuery ?? (b.address?.coordinates
            ? `${b.address.coordinates.lat},${b.address.coordinates.lng}`
            : encodeURIComponent(addressStr));

          const key = b._id ?? b.id ?? b.code;

          return (
            <div key={key} className="rounded-[1.5rem] border border-ochre/30 bg-[#1C1214]/95 p-6 shadow-glass-dark text-ivory-50 font-body">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FFC86B]">{b.type}</p>
              <h4 className="mt-1 font-display text-2xl text-white">{b.name}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-ivory-200/90">
                <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 text-[#FFC86B] mt-0.5" /><span>{addressStr}</span></li>
                <li className="flex gap-2"><Phone className="h-4 w-4 shrink-0 text-[#FFC86B] mt-0.5" /><a className="hover:text-[#FFC86B] font-medium" href={`tel:${phone}`}>{phoneDisplay}</a></li>
                <li className="flex gap-2"><Mail className="h-4 w-4 shrink-0 text-[#FFC86B] mt-0.5" /><a className="hover:text-[#FFC86B] font-medium" href={`mailto:${email}`}>{email}</a></li>
                <li><span className="text-white font-bold">OP timing:</span> {opTiming}</li>
                <li><span className="text-white font-bold">Hospital timing:</span> {hospitalTiming}</li>
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ochre/40 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 hover:border-[#FFC86B] transition-colors">
                  <Phone className="h-3.5 w-3.5 text-[#FFC86B]" /> Call
                </a>
                <a href={brand.contact.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ochre/40 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 hover:border-[#FFC86B] transition-colors">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-400" /> WhatsApp
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ochre/40 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 hover:border-[#FFC86B] transition-colors">
                  <MapPin className="h-3.5 w-3.5 text-[#FFC86B]" /> Directions
                </a>
                <a href={brand.contact.googleReview} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-ochre/40 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 hover:border-[#FFC86B] transition-colors">
                  <Star className="h-3.5 w-3.5 text-[#FFC86B]" /> Leave Review
                </a>
              </div>
            </div>
          );
        })}
      </aside>
    </div>
  );
}

export default function AppointmentHub({ defaultTab = 'appointment' as Tab }: { defaultTab?: Tab }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sus-muted">Loading appointment form...</div>}>
      <AppointmentHubContent defaultTab={defaultTab} />
    </Suspense>
  );
}

