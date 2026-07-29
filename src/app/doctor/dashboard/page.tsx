'use client';

import React, { useState } from 'react';
import { Calendar, Users, FileText, CheckCircle2, Clock, Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export default function DoctorDashboard() {
  const [isEhrModalOpen, setIsEhrModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);


  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-b border-primary/10 pb-6">
        <div>
          <Badge variant="gold" className="mb-2">DOCTOR & CONSULTANT PORTAL</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary">
            Welcome, Dr. Vikram Varma
          </h1>
          <p className="font-sans text-text-secondary text-xs mt-1">
            Chief Medical Officer • Department of Kaya Chikitsa & Panchakarma
          </p>
        </div>

        <Button variant="gold" icon={<Plus className="w-4 h-4" />} onClick={() => setIsEhrModalOpen(true)}>
          WRITE NEW PRESCRIPTION
        </Button>
      </div>

      {/* Doctor Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="TODAY'S CONSULTATIONS"
          value="6 Patients"
          subtitle="Next: Ananya Sharma (10:30 AM)"
          icon={<Users className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="ACTIVE PANCHAKARMA"
          value="4 Patients"
          subtitle="7-Day Rejuvenation Protocol"
          icon={<Clock className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="REPORTS TO REVIEW"
          value="3 Lab Files"
          subtitle="Prakriti Pulse Diagnostics"
          icon={<FileText className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="MONTHLY PATIENTS"
          value="142 Healed"
          trend="+12%"
          trendDirection="up"
          icon={<CheckCircle2 className="w-5 h-5 text-gold" />}
        />
      </div>

      {/* Today's Schedule Table */}
      <div className="flex flex-col gap-6">
        <h3 className="font-display text-2xl font-bold text-primary">Today&apos;s Appointment Roster</h3>

        <Table
          data={appointments}
          keyExtractor={(r) => r.id || r._id || Math.random().toString()}
          columns={[
            { header: 'SLOT TIME', accessorKey: 'time', className: 'font-bold text-primary' },
            { header: 'PATIENT NAME', accessorKey: 'patientName' },
            { header: 'RITUAL / CONSULTATION', accessorKey: 'treatmentName' },
            {
              header: 'TYPE',
              accessorKey: (r) => <Badge variant="gold">{r.type}</Badge>
            },
            {
              header: 'STATUS',
              accessorKey: (r) => (
                <Badge variant={r.status === 'Confirmed' ? 'success' : 'warning'}>
                  {r.status}
                </Badge>
              )
            },
            {
              header: 'ACTIONS',
              accessorKey: () => (
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">EHR Note</Button>
                  <Button variant="gold" size="sm">Start</Button>
                </div>
              )
            }
          ]}
        />
      </div>

      {/* EHR Prescription Writer Modal */}
      <Modal isOpen={isEhrModalOpen} onClose={() => setIsEhrModalOpen(false)} title="New Prescription / EHR Entry">
        <form onSubmit={(e) => { e.preventDefault(); setIsEhrModalOpen(false); }} className="flex flex-col gap-4">
          <Input label="PATIENT NAME / ID" placeholder="e.g. Ananya Sharma (SUS-PT-9042)" required />
          <Select
            label="PRIMARY DOSHA IMBALANCE"
            options={[
              { label: 'Vata Imbalance (Nervous System & Joints)', value: 'vata' },
              { label: 'Pitta Imbalance (Metabolism & Inflammation)', value: 'pitta' },
              { label: 'Kapha Imbalance (Lethargy & Congestion)', value: 'kapha' }
            ]}
          />
          <Input label="PRESCRIBED HERBAL FORMULATION" placeholder="e.g. Brahmi Rasayana - 1 tsp at bedtime" required />
          <Input label="RECOMMENDED RITUAL / THERAPY" placeholder="e.g. 7-Day Panchakarma Detox" />
          <div className="flex justify-end gap-3 pt-4 border-t border-primary/10">
            <Button variant="ghost" type="button" onClick={() => setIsEhrModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="gold" type="submit">
              SAVE & ISSUE PRESCRIPTION
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
