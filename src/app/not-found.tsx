'use client';

import { useEffect } from 'react';
import { Button } from '../components/ui';
import { pageTitle } from '../lib/seo';

export default function NotFoundPage() {
  useEffect(() => {
    document.title = pageTitle('Page not found');
  }, []);

  return (
    <div className="container-wide section-pad py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-sus-gold">404</p>
      <h1 className="mt-3 font-display text-4xl text-sus-green-deep">This page is not in the care map</h1>
      <p className="mt-4 text-sus-muted">Try search from the header, or return home.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button to="/">Home</Button>
        <Button to="/contact" variant="secondary">Contact</Button>
      </div>
    </div>
  );
}
