'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, FileText, Pill, Clock, ChevronRight, User, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Tabs } from '@/components/ui/Tabs';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);


  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-b border-primary/10 pb-6">
        <div>
          <Badge variant="gold" className="mb-2">PATIENT HEALTH PORTAL</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary">
            Welcome, Ananya Sharma
          </h1>
          <p className="font-sans text-text-secondary text-xs mt-1">
            Prakriti Constitution: <span className="font-bold text-primary">Vata-Pitta</span> • Patient ID: SUS-PT-9042
          </p>
        </div>

        <Link href="/booking">
          <Button variant="gold" icon={<Plus className="w-4 h-4" />}>
            BOOK NEW THERAPY
          </Button>
        </Link>
      </div>

      {/* Health Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="UPCOMING RITUALS"
          value="2"
          subtitle="Next: Aug 02, 10:30 AM"
          icon={<Calendar className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="ACTIVE PRESCRIPTIONS"
          value="3 Formulations"
          subtitle="Refill Due in 12 Days"
          icon={<Pill className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="MEDICAL REPORTS"
          value="8 Documents"
          subtitle="Prakriti Pulse Analysis"
          icon={<FileText className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="WELLNESS SCORE"
          value="94 / 100"
          trend="+6% this month"
          trendDirection="up"
          icon={<User className="w-5 h-5 text-gold" />}
        />
      </div>

      {/* Appointments & Consultations */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-2xl font-bold text-primary">Your Appointments</h3>
          <Tabs
            tabs={[
              { id: 'upcoming', label: 'Upcoming', count: 2 },
              { id: 'completed', label: 'Past History', count: 5 }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <Table
          data={appointments}
          keyExtractor={(row) => row.id || row._id || Math.random().toString()}
          columns={[
            { header: 'APPOINTMENT ID', accessorKey: 'id', className: 'font-bold font-mono text-xs text-gold-dark' },
            { header: 'RITUAL / SERVICE', accessorKey: 'treatmentName' },
            { header: 'ATTENDING DOCTOR', accessorKey: 'doctorName' },
            { header: 'DATE & TIME', accessorKey: (r) => `${r.date} at ${r.time}` },
            {
              header: 'STATUS',
              accessorKey: (r) => (
                <Badge variant={r.status === 'Confirmed' ? 'success' : 'warning'}>
                  {r.status}
                </Badge>
              )
            },
            {
              header: 'ACTION',
              accessorKey: () => (
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              )
            }
          ]}
        />
      </div>

      {/* Active Formulations / Prescriptions */}
      <div className="flex flex-col gap-6">
        <h3 className="font-display text-2xl font-bold text-primary">Prescribed Formulations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="default" className="p-6 border-gold/20">
            <Badge variant="gold" className="mb-2">HERBAL TONIC</Badge>
            <h4 className="font-display text-xl font-bold text-primary mb-1">Brahmi Rasayana</h4>
            <p className="font-sans text-xs text-text-secondary mb-4">1 tsp before sleep with warm golden milk.</p>
            <div className="text-[10px] font-sans font-bold text-text-muted">PRESCRIBED BY: DR. VIKRAM VARMA</div>
          </Card>
          <Card variant="default" className="p-6 border-gold/20">
            <Badge variant="gold" className="mb-2">MEDICINAL OIL</Badge>
            <h4 className="font-display text-xl font-bold text-primary mb-1">Ksheerabala Thailam</h4>
            <p className="font-sans text-xs text-text-secondary mb-4">Self-massage to scalp and feet prior to bath.</p>
            <div className="text-[10px] font-sans font-bold text-text-muted">PRESCRIBED BY: DR. MAYA NAIR</div>
          </Card>
          <Card variant="default" className="p-6 border-gold/20">
            <Badge variant="bronze" className="mb-2">DIGESTIVE POWDER</Badge>
            <h4 className="font-display text-xl font-bold text-primary mb-1">Triphala Churna</h4>
            <p className="font-sans text-xs text-text-secondary mb-4">1/2 tsp after dinner with warm water.</p>
            <div className="text-[10px] font-sans font-bold text-text-muted">PRESCRIBED BY: DR. ARYAN GUPTA</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
