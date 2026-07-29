'use client';

import React, { useState } from 'react';
import { DollarSign, Users, Calendar, Stethoscope, Plus, TrendingUp, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Tabs } from '@/components/ui/Tabs';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from '@/lib/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-10 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-b border-primary/10 pb-6">
        <div>
          <Badge variant="gold" className="mb-2">SUSRUTHA EXECUTIVE MANAGEMENT</Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary">
            Admin Operations & Analytics
          </h1>
          <p className="font-sans text-text-secondary text-xs mt-1">
            System Overseer • All Sanctuaries & Clinical Branches
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="sm">EXPORT ANALYTICS</Button>
          <Button variant="gold" size="sm" icon={<Plus className="w-4 h-4" />}>ADD DOCTOR</Button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="MONTHLY REVENUE"
          value="₹ 48,50,000"
          trend="+18.4% vs last mo"
          trendDirection="up"
          icon={<DollarSign className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="TOTAL APPOINTMENTS"
          value="1,248"
          subtitle="96.2% Completion Rate"
          icon={<Calendar className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="ACTIVE PATIENTS"
          value="3,890"
          trend="+140 new this week"
          trendDirection="up"
          icon={<Users className="w-5 h-5 text-gold" />}
        />
        <StatCard
          title="SANCTUARY OCCUPANCY"
          value="92%"
          subtitle="Rishikesh & Kerala Full"
          icon={<ShieldCheck className="w-5 h-5 text-gold" />}
        />
      </div>

      {/* Tab Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-2xl font-bold text-primary">Management Console</h3>
          <Tabs
            tabs={[
              { id: 'appointments', label: 'All Appointments', count: MOCK_APPOINTMENTS.length },
              { id: 'doctors', label: 'Doctor Roster', count: MOCK_DOCTORS.length }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {activeTab === 'appointments' ? (
          <Table
            data={MOCK_APPOINTMENTS}
            keyExtractor={(r) => r.id}
            columns={[
              { header: 'ID', accessorKey: 'id', className: 'font-mono text-xs font-bold text-gold-dark' },
              { header: 'PATIENT', accessorKey: 'patientName' },
              { header: 'DOCTOR', accessorKey: 'doctorName' },
              { header: 'RITUAL', accessorKey: 'treatmentName' },
              { header: 'DATE', accessorKey: 'date' },
              {
                header: 'STATUS',
                accessorKey: (r) => (
                  <Badge variant={r.status === 'Confirmed' ? 'success' : 'warning'}>
                    {r.status}
                  </Badge>
                )
              },
              {
                header: 'AMOUNT',
                accessorKey: (r) => <span className="font-bold">₹ {r.amount.toLocaleString()}</span>
              }
            ]}
          />
        ) : (
          <Table
            data={MOCK_DOCTORS}
            keyExtractor={(d) => d.id || d._id || d.name}
            columns={[
              { header: 'NAME', accessorKey: 'name', className: 'font-bold text-primary' },
              { header: 'SPECIALIZATION', accessorKey: (d) => d.specialization || 'Kaya Chikitsa' },
              { header: 'TITLE', accessorKey: (d) => d.title || d.designation || 'Senior Physician' },
              { header: 'EXPERIENCE', accessorKey: (d) => `${d.experienceYears || 15} Years` },
              { header: 'PATIENTS HEALED', accessorKey: (d) => (d.patientsCount || 1000).toLocaleString() },
              { header: 'RATING', accessorKey: (d) => `★ ${d.rating || 4.9}` }
            ]}
          />
        )}
      </div>
    </div>
  );
}
