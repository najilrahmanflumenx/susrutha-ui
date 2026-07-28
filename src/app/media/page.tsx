'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, Button, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getMedia } from '../../lib/api';

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Media');
    getMedia().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) {
        setMediaItems(data);
      }
    });
  }, []);

  const fallbackGallery = [
    { src: '/images/hero-ayurveda.jpg', alt: 'Care atmosphere', title: 'Hospital Campus' },
    { src: '/images/panchakarma.jpg', alt: 'Therapy', title: 'Classical Panchakarma' },
    { src: '/images/hospital-room.jpg', alt: 'Inpatient room', title: '40-Bed IPD Ward' },
    { src: '/images/ayur-village.jpg', alt: 'Ayur Village', title: 'Kattakada Facility' },
    { src: '/images/yoga-hall.jpg', alt: 'Movement space', title: 'Yoga & Meditation Hall' },
    { src: '/images/herbs-mortar.jpg', alt: 'Herbal preparations', title: 'Ayurvedic Pharmacy' },
    { src: '/images/kerala-nature.jpg', alt: 'Kerala setting', title: 'Healing Environment' },
    { src: '/images/doctor-portrait.jpg', alt: 'Clinical presence', title: 'Senior Physicians' },
  ];

  return (
    <div>
      <PageHero eyebrow="Media" title="Photos & News Coverage" description="Press releases, newspaper clippings, awards, and photo gallery of Susrutha Hospital." />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Media' }]} />
        <div className="mb-8 flex flex-wrap gap-4">
          <Button to="/videos">Open Video Gallery</Button>
        </div>

        {mediaItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {mediaItems.map((item: any, idx: number) => (
              <div key={item._id || idx} className="rounded-2xl border border-sus-green/10 bg-white p-5 hover:border-sus-green/30 transition-all">
                {item.coverImage && (
                  <img src={item.coverImage} alt={item.title} className="aspect-video w-full object-cover rounded-xl mb-4" />
                )}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sus-gold">{item.type || 'Press Release'}</span>
                <h3 className="font-display text-xl text-sus-green-deep mt-1">{item.title}</h3>
                {item.publisherName && <p className="text-xs text-sus-muted mt-1">Publisher: {item.publisherName}</p>}
                <p className="text-sm text-sus-muted mt-3 line-clamp-3">{item.summary}</p>
                {item.externalLink && (
                  <a href={item.externalLink} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs font-semibold text-sus-green hover:underline">
                    Read Original Article →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : null}

        <h2 className="font-display text-2xl text-sus-green-deep mb-6">Campus & Facility Gallery</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {fallbackGallery.map((g) => (
            <figure key={g.src} className="overflow-hidden rounded-2xl bg-sus-sand">
              <img src={g.src} alt={g.alt} className="aspect-square w-full object-cover" loading="lazy" />
              <figcaption className="px-3 py-2 text-xs text-sus-muted font-medium">{g.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

