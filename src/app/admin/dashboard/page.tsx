'use client';

import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboardRedirect() {
  const ADMIN_PORTAL_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3000';

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <Card variant="bordered" className="max-w-md w-full p-8 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <Badge variant="gold">SUSRUTHA CMS PORTAL</Badge>
        <h2 className="font-display text-2xl font-bold text-primary">Official Admin Management</h2>
        <p className="font-sans text-xs text-text-secondary leading-relaxed">
          The Susrutha Administrative CMS Portal is located at the dedicated admin app suite. Click below to open the CMS console.
        </p>
        <a href={ADMIN_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="w-full mt-2">
          <Button variant="gold" className="w-full justify-center" icon={<ExternalLink className="w-4 h-4" />}>
            OPEN ADMIN CMS PORTAL
          </Button>
        </a>
      </Card>
    </div>
  );
}

