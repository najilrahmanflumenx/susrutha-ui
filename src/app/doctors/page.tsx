'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs, PageHero, SectionHeading } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { cn } from '../../lib/utils';
import { getDoctors, getBranches, getDepartments } from '../../lib/api';
import { doctors } from '../../data/doctors';
import { branches } from '../../data/site';
import { specialties as staticSpecialties } from '../../data/specialties';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DoctorsPage() {
  const [branch, setBranch] = useState('all');
  const [specialty, setSpecialty] = useState('all');
  const [day, setDay] = useState('all');
  const [doctorList, setDoctorList] = useState<any[]>(
    doctors.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      qual: d.qual,
      role: d.role,
      image: d.image || '/images/doctor-portrait.jpg',
      isDirector: !!d.isDirector,
      availabilityArr: [],
      availabilityStr: d.availability || 'Mon - Sat (OPD)',
      specialties: d.pillars || [],
      branchIds: d.branchIds || ['kattakada'],
      branchCodes: d.branchIds || ['KTK'],
      departmentId: d.specialtyIds?.[0] || 'gen',
      departmentName: 'Ayurveda Specialist',
    }))
  );
  const [branchList, setBranchList] = useState<any[]>(
    branches.map((b) => ({ _id: b.id, name: b.name, code: b.code }))
  );
  const [departmentList, setDepartmentList] = useState<any[]>(
    staticSpecialties.map((s) => ({ _id: s.id, title: s.name }))
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = pageTitle('Doctors');
    }

    getBranches().then((brs) => {
      if (brs && Array.isArray(brs) && brs.length > 0) setBranchList(brs);
    });

    getDepartments().then((depts) => {
      if (depts && Array.isArray(depts) && depts.length > 0) setDepartmentList(depts);
    });

    getDoctors().then((apiDoctors) => {
      if (apiDoctors && Array.isArray(apiDoctors) && apiDoctors.length > 0) {
        const mapped = apiDoctors.map((d: any) => ({
          id: d._id || d.slug || d.id,
          slug: d.slug,
          name: d.name,
          qual: d.qualifications || d.qual || 'BAMS',
          role: d.designation || d.role || 'Ayurvedic Physician',
          image: d.photo || d.image || '/images/doctor-portrait.jpg',
          isDirector: !!d.isDirector,
          availabilityArr: Array.isArray(d.availability) ? d.availability : [],
          availabilityStr: typeof d.availability === 'string' ? d.availability : 'Mon - Sat (OPD)',
          specialties: d.specialties || d.pillars || [],
          branchIds: (d.assignedBranchIds || d.branchIds || []).map((b: any) =>
            typeof b === 'object' && b !== null ? String(b._id || b.id) : String(b)
          ),
          branchCodes: (d.assignedBranchIds || d.branchIds || []).map((b: any) =>
            typeof b === 'object' && b !== null ? b.code : b
          ).filter(Boolean),
          departmentId: d.departmentId
            ? (typeof d.departmentId === 'object' ? String(d.departmentId._id) : String(d.departmentId))
            : null,
          departmentName: d.departmentId?.title || 'Ayurveda Specialist',
        }));
        setDoctorList(mapped);
      }
    });
  }, []);

  const getAvailabilityLabel = (d: any) => {
    if (d.availabilityStr) return d.availabilityStr;
    if (d.availabilityArr.length === 0) return 'By appointment';
    return d.availabilityArr.map((a: any) => `${a.branchCode}: ${a.day}`).join('; ');
  };

  const filtered = useMemo(() => {
    return doctorList.filter((d) => {
      if (branch !== 'all') {
        const hasBranch = d.branchIds.includes(branch);
        if (!hasBranch) return false;
      }
      if (specialty !== 'all') {
        if (d.departmentId !== specialty) return false;
      }
      if (day !== 'all') {
        if (day === 'appointment') {
          if (d.availabilityArr.length > 0) return false;
        } else {
          const availLower = JSON.stringify(d.availabilityArr).toLowerCase() + ' ' + d.availabilityStr.toLowerCase();
          if (!availLower.includes(day.toLowerCase())) return false;
        }
      }
      return true;
    });
  }, [doctorList, branch, specialty, day]);

  const directors = useMemo(() => filtered.filter((d) => d.isDirector), [filtered]);
  const others = useMemo(() => filtered.filter((d) => !d.isDirector), [filtered]);

  return (
    <div className="font-body min-h-screen bg-[#120A0B] text-[#FDFBF7]">
      <PageHero
        eyebrow="Medical Roster & Specialists"
        title="Consulting Ayurvedic Physicians & Chief Doctors"
        description="Our clinical panel brings decades of classical Vaidya lineage, academic research, and hospital care expertise."
      />
      <div className="container-wide section-pad py-16">
        <Breadcrumbs items={[{ label: 'Doctors' }]} />

        {/* Filter Toolbar */}
        <div className="my-8 grid gap-4 rounded-3xl border border-ochre/30 bg-[#240809]/90 p-6 sm:p-7 backdrop-blur-2xl shadow-2xl md:grid-cols-3">
          {/* Branch dropdown */}
          <div>
            <label htmlFor="filter-branch" className="text-xs uppercase tracking-wider font-bold text-[#FCAB28]">Hospital Campus</label>
            <select
              id="filter-branch"
              className="mt-1.5 w-full rounded-2xl border border-ochre/30 bg-[#160506] px-4 py-2.5 text-sm font-semibold text-white focus:border-[#FCAB28] focus:outline-none"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="all">All Locations (Kattakada & Kowdiar)</option>
              {branchList.map((b: any) => (
                <option key={b._id} value={String(b._id)}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Speciality dropdown */}
          <div>
            <label htmlFor="filter-spec" className="text-xs uppercase tracking-wider font-bold text-[#FCAB28]">Speciality Department</label>
            <select
              id="filter-spec"
              className="mt-1.5 w-full rounded-2xl border border-ochre/30 bg-[#160506] px-4 py-2.5 text-sm font-semibold text-white focus:border-[#FCAB28] focus:outline-none"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="all">All Specialities</option>
              {departmentList.map((dept: any) => (
                <option key={dept._id} value={String(dept._id)}>{dept.title}</option>
              ))}
            </select>
          </div>

          {/* Day keyword */}
          <div>
            <label htmlFor="filter-day" className="text-xs uppercase tracking-wider font-bold text-[#FCAB28]">Clinic Availability Day</label>
            <select
              id="filter-day"
              className="mt-1.5 w-full rounded-2xl border border-ochre/30 bg-[#160506] px-4 py-2.5 text-sm font-semibold text-white focus:border-[#FCAB28] focus:outline-none"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="all">Any Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
              <option value="appointment">By Appointment Only</option>
            </select>
          </div>
        </div>

        {/* Directors Grid */}
        <section className="mt-16">
          <SectionHeading light eyebrow="Senior Leadership" title="Directors & Clinical Leadership" />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {directors.length === 0 && <p className="text-ivory-300">No directors match these filter criteria.</p>}
            {directors.map((d) => (
              <Link key={d.id} href={`/doctors/${d.slug}`} className="group overflow-hidden rounded-3xl border border-ochre/30 border-t-2 border-t-[#FCAB28] bg-[#240809]/90 shadow-2xl backdrop-blur-2xl hover:border-[#FCAB28] transition-all hover:-translate-y-1">
                <div className="aspect-[5/3] overflow-hidden bg-[#160506]">
                  <img src={d.image} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                </div>
                <div className="p-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FCAB28]/15 border border-[#FCAB28]/40 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#FCAB28]">Director</span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-white group-hover:text-[#FCAB28] transition-colors">{d.name}</h2>
                  <p className="text-sm font-semibold text-[#FCAB28]">{d.qual}</p>
                  <p className="mt-2 text-sm text-ivory-200/80 line-clamp-2">{d.role}</p>
                  <p className="mt-3 text-xs font-bold text-[#FCAB28]">{getAvailabilityLabel(d)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {d.specialties.slice(0, 2).map((p: string) => (
                      <span key={p} className="rounded-full bg-[#160506] border border-ochre/25 px-3 py-1 text-[11px] font-semibold text-[#FDFBF7]">{p}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Roster Physicians Grid */}
        <section className="mt-20">
          <SectionHeading light eyebrow="Medical Roster" title="Consulting Physicians & Specialists" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {others.length === 0 && <p className="text-ivory-300">No roster doctors match these filter criteria.</p>}
            {others.map((d) => (
              <Link key={d.id} href={`/doctors/${d.slug}`} className="group rounded-3xl border border-ochre/30 border-t-2 border-t-[#FCAB28] bg-[#240809]/90 p-6 shadow-2xl backdrop-blur-2xl hover:border-[#FCAB28] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white group-hover:text-[#FCAB28] transition-colors">{d.name}</h2>
                    <p className="text-sm font-semibold text-[#FCAB28] mt-1">{d.qual}</p>
                    <p className="text-sm text-ivory-200/80 mt-2">{d.role}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FCAB28]/15 border border-[#FCAB28]/40 px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-[#FCAB28]">Verified</span>
                </div>
                <p className="mt-3 text-xs font-bold text-[#FCAB28]">{getAvailabilityLabel(d)}</p>
                {d.branchCodes.length > 0 && (
                  <div className="mt-3 flex gap-1.5 flex-wrap">
                    {d.branchCodes.map((code: string) => (
                      <span key={code} className="rounded-full border border-ochre/30 bg-[#160506] px-2.5 py-0.5 text-[10px] font-bold text-[#FCAB28]">{code}</span>
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
