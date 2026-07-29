'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function LoginPage() {
  const [role, setRole] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'patient') router.push('/patient/dashboard');
    else if (role === 'doctor') router.push('/doctor/dashboard');
    else router.push('/admin/dashboard');
  };

  return (
    <div className="px-6 max-w-md mx-auto py-16 flex flex-col gap-8">
      <div className="text-center">
        <img src="/images/logo.png" alt="Susrutha Logo" className="h-12 w-auto mx-auto mb-6 object-contain" />
        <h1 className="font-display text-3xl font-bold text-primary mb-2">Welcome Back</h1>
        <p className="font-sans text-text-secondary text-xs">
          Access your Susrutha Health & Medical Portal
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 bg-surface-elevated p-1.5 rounded-2xl border border-primary/10 text-center font-sans text-xs font-bold">
        <button
          type="button"
          onClick={() => setRole('patient')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            role === 'patient' ? 'bg-primary text-gold shadow-md' : 'text-text-secondary hover:text-primary'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Patient
        </button>
        <button
          type="button"
          onClick={() => setRole('doctor')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            role === 'doctor' ? 'bg-primary text-gold shadow-md' : 'text-text-secondary hover:text-primary'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" /> Doctor
        </button>
        <button
          type="button"
          onClick={() => setRole('admin')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            role === 'admin' ? 'bg-primary text-gold shadow-md' : 'text-text-secondary hover:text-primary'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Admin
        </button>
      </div>

      <Card variant="default" className="p-8 border-gold/30 shadow-xl">
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <Input
            label="EMAIL ADDRESS"
            type="email"
            placeholder="user@susrutha.org"
            required
            icon={<Mail className="w-4 h-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="PASSWORD"
            type="password"
            placeholder="••••••••"
            required
            icon={<Lock className="w-4 h-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-xs font-sans">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-primary/20 text-gold focus:ring-gold" />
              <span>Remember Me</span>
            </label>
            <a href="#" className="text-gold font-bold hover:underline">Forgot Password?</a>
          </div>

          <Button type="submit" variant="gold" className="w-full mt-2" icon={<ArrowRight className="w-4 h-4" />}>
            SIGN IN TO {role.toUpperCase()} PORTAL
          </Button>
        </form>
      </Card>
    </div>
  );
}
