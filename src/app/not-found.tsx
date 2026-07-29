import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <h1 className="font-display text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="font-display text-2xl font-bold text-primary mb-4">Page Not Found</h2>
      <p className="font-sans text-text-secondary text-sm max-w-md mb-8">
        The sanctuary page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="gold">RETURN TO HOME</Button>
      </Link>
    </div>
  );
}
