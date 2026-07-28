'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs, PageHero, SectionHeading } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { cn } from '../../lib/utils';
import { getDoctors, getBranches, getDepartments } from '../../lib/api';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DoctorsPage() {
  const [branch, setBranch] = useState('all');
  const [specialty, setSpecialty] = useState('all');
  const [day, setDay] = useState('all');
  const [doctorList, setDoctorList] = useState<any[]>([]);
  const [branchList, setBranchList] = useState<any[]>([]);
  const [departmentList, setDepartmentList] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Doctors');

    // Fetch branches and departments for dropdowns
    getBranches().then((brs) => {
      if (brs && Array.isArray(brs) && brs.length > 0) setBranchList(brs);
    });

    getDepartments().then((depts) => {
      if (depts && Array.isArray(depts) && depts.length > 0) setDepartmentList(depts);
    });

    // Fetch all doctors (no branch filter at API level — we filter client-side)
    getDoctors().then((apiDoctors) => {
      if (apiDoctors && Array.isArray(apiDoctors) && apiDoctors.length > 0) {
        const mapped = apiDoctors.map((d: any) => ({
          id: d._id || d.slug,
          slug: d.slug,
          name: d.name,
          qual: d.qualifications || 'BAMS',
          role: d.designation || 'Ayurvedic Physician',
          image: d.photo || '/images/doctor-portrait.jpg',
          isDirector: !!d.isDirector,
          // Availability: array of {branchId, days, timeSlots} or fallback string
          availabilityArr: Array.isArray(d.availability) ? d.availability : [],
          availabilityStr: typeof d.availability === 'string' ? d.availability : '',
          specialties: d.specialties || [],
          // assignedBranchIds: populated objects {_id, name, code} or raw ObjectID strings
          branchIds: (d.assignedBranchIds || []).map((b: any) =>
            typeof b === 'object' && b !== null ? String(b._id) : String(b)
          ),
          branchCodes: (d.assignedBranchIds || []).map((b: any) =>
            typeof b === 'object' && b !== null ? b.code : null
          ).filter(Boolean),
          // Department
          departmentId: d.departmentId
            ? (typeof d.departmentId === 'object' ? String(d.departmentId._id) : String(d.departmentId))
            : null,
          departmentName: d.departmentId?.title || '',
        }));
        setDoctorList(mapped);
      }
    });
  }, []);

  // Helper: get availability label for a doctor
  const getAvailabilityLabel = (d: any) => {
    if (d.availabilityStr) return d.availabilityStr;
    if (d.availabilityArr.length === 0) return 'By appointment';
    // Combine all days across branches
    const allDays = Array.from(new Set(d.availabilityArr.flatMap((a: any) => a.days || [])));
    return allDays.length > 0 ? allDays.join(', ') : 'By appointment';
  };

  const filtered = useMemo(() => {
    return doctorList.filter((d) => {
      // Branch filter: compare selected branch _id against doctor's branchIds
      if (branch !== 'all' && !d.branchIds.includes(branch)) return false;

      // Speciality filter: compare against department _id
      if (specialty !== 'all' && d.departmentId !== specialty) return false;

      // Day keyword filter: check days across all availability entries
      if (day !== 'all') {
        const allDays = d.availabilityArr.flatMap((a: any) => a.days || []);
        const dayStr = allDays.join(' ').toLowerCase() + ' ' + d.availabilityStr.toLowerCase();
        if (!dayStr.includes(day.toLowerCase())) return false;
      }

      return true;
    });
  }, [doctorList, branch, specialty, day]);

  const directors = filtered.filter((d) => d.isDirector);
  const others = filtered.filter((d) => !d.isDirector);

  return (
    <div>
      <PageHero
        eyebrow="Clinical team"
        title="Doctors of Susrutha"
        description="Directors first — then the full roster. Filter by branch, speciality focus or clinic day language from published availability."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Doctors' }]} />

        <div className="grid gap-4 rounded-2xl border border-sus-green/10 bg-white p-4 sm:p-5 md:grid-cols-3">
          {/* Branch dropdown — from API */}
          <div>
            <label htmlFor="filter-branch" className="text-xs uppercase tracking-wider text-sus-gold">Branch</label>
            <select
              id="filter-branch"
              className="mt-1 w-full rounded-xl border border-sus-green/15 bg-sus-cream/50 px-3 py-2.5"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="all">All branches</option>
              {branchList.map((b: any) => (
                <option key={b._id} value={String(b._id)}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Speciality dropdown — from API departments */}
          <div>
            <label htmlFor="filter-spec" className="text-xs uppercase tracking-wider text-sus-gold">Speciality</label>
            <select
              id="filter-spec"
              className="mt-1 w-full rounded-xl border border-sus-green/15 bg-sus-cream/50 px-3 py-2.5"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="all">All specialities</option>
              {departmentList.map((dept: any) => (
                <option key={dept._id} value={String(dept._id)}>{dept.title}</option>
              ))}
            </select>
          </div>

          {/* Day keyword — always static */}
          <div>
            <label htmlFor="filter-day" className="text-xs uppercase tracking-wider text-sus-gold">Day keyword</label>
            <select
              id="filter-day"
              className="mt-1 w-full rounded-xl border border-sus-green/15 bg-sus-cream/50 px-3 py-2.5"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="all">Any day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="appointment">By appointment</option>
            </select>
          </div>
        </div>

        <section className="mt-12">
          <SectionHeading eyebrow="Directors" title="Thought leadership & clinical direction" />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {directors.length === 0 && <p className="text-sus-muted">No directors match these filters.</p>}
            {directors.map((d) => (
              <Link key={d.id} href={`/doctors/${d.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-sus-green/10 bg-white hover:border-sus-green/25 transition-all hover:-translate-y-1">
                <div className="aspect-[5/3] overflow-hidden bg-sus-sand">
                  <img src={d.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-sus-gold">Director</p>
                  <h2 className="mt-1 font-display text-2xl text-sus-green-deep">{d.name}</h2>
                  <p className="text-sm text-sus-muted">{d.qual}</p>
                  <p className="mt-3 text-sm text-sus-muted line-clamp-2">{d.role}</p>
                  <p className="mt-3 text-xs text-sus-green">{getAvailabilityLabel(d)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {d.specialties.slice(0, 2).map((p: string) => (
                      <span key={p} className="rounded-full bg-sus-sand/70 px-2.5 py-1 text-[11px] text-sus-green-deep">{p}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionHeading eyebrow="Roster" title="Consulting physicians & specialists" />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {others.length === 0 && <p className="text-sus-muted">No roster doctors match these filters.</p>}
            {others.map((d) => (
              <Link key={d.id} href={`/doctors/${d.slug}`} className={cn('rounded-2xl border border-sus-green/10 bg-white p-5 hover:border-sus-green/25 transition-colors')}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl text-sus-green-deep">{d.name}</h2>
                    <p className="text-sm text-sus-muted mt-1">{d.qual}</p>
                    <p className="text-sm text-sus-ink/80 mt-2">{d.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-sus-sand px-2.5 py-1 text-[10px] uppercase tracking-wide text-sus-green">Verified</span>
                </div>
                <p className="mt-3 text-xs text-sus-green">{getAvailabilityLabel(d)}</p>
                {d.branchCodes.length > 0 && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {d.branchCodes.map((code: string) => (
                      <span key={code} className="rounded-full border border-sus-green/15 px-2 py-0.5 text-[10px] text-sus-green-deep">{code}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
