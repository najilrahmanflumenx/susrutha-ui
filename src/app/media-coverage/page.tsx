'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, Award, ExternalLink, ShieldCheck, Sparkles, Eye, ZoomIn, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, Chip } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fetchNewsEvents, fetchAffiliations, NewsEventItem, AffiliationItem } from '@/lib/api';

export default function PublicMediaCoveragePage() {
  const [activeTab, setActiveTab] = useState<'PRESS' | 'ACCREDITATIONS'>('PRESS');
  const [pressItems, setPressItems] = useState<NewsEventItem[]>([]);
  const [affiliations, setAffiliations] = useState<AffiliationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<NewsEventItem | null>(null);
  const [activeCert, setActiveCert] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (activeTab === 'PRESS') {
        const data = await fetchNewsEvents();
        setPressItems(data);
      } else {
        const data = await fetchAffiliations();
        setAffiliations(data);
      }
      setLoading(false);
    }
    load();
  }, [activeTab]);

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <Badge variant="gold" className="mb-4" icon={<Newspaper className="w-3.5 h-3.5" />}>
          MEDIA RELEASES & CLINICAL TRUST
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Press & Accreditations
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Discover news coverage, national press features, government NABH certifications, and hospital affiliations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center items-center gap-3">
        <Chip
          active={activeTab === 'PRESS'}
          onClick={() => setActiveTab('PRESS')}
        >
          News & Press Coverage
        </Chip>
        <Chip
          active={activeTab === 'ACCREDITATIONS'}
          onClick={() => setActiveTab('ACCREDITATIONS')}
        >
          Accreditations & Certificates
        </Chip>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-3xl h-64" />
          ))}
        </div>
      )}

      {/* Press Coverage Grid */}
      {!loading && activeTab === 'PRESS' && pressItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pressItems.map((item, idx) => (
            <Card
              key={item.id || item._id || idx}
              variant="default"
              className="flex flex-col justify-between p-8 border border-primary/10 shadow-md hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setActiveArticle(item)}
            >
              <div className="flex flex-col gap-4">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full w-fit border border-gold/20">
                  {item.publisherName || 'Press Release'}
                </span>
                <h3 className="font-display text-2xl font-bold text-primary group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {item.summary || item.content}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/10 flex justify-between items-center">
                <span className="font-sans text-xs text-text-muted">Click to read inline</span>
                <button
                  type="button"
                  className="font-sans text-xs font-bold text-gold group-hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" /> READ INLINE
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Accreditations Grid */}
      {!loading && activeTab === 'ACCREDITATIONS' && affiliations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {affiliations.map((aff, idx) => (
            <Card
              key={aff.id || aff._id || idx}
              variant="default"
              className="flex flex-col justify-between overflow-hidden p-6 border border-primary/10 shadow-md hover:shadow-xl transition-all gap-6"
            >
              {/* High Resolution Certificate Display */}
              <div
                className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900/5 border border-primary/10 cursor-pointer group flex items-center justify-center p-3 shadow-inner"
                onClick={() => aff.logoUrl && setActiveCert({ url: aff.logoUrl, title: aff.name })}
              >
                {aff.logoUrl ? (
                  <img
                    src={aff.logoUrl}
                    alt={aff.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gold">
                    <ShieldCheck className="w-12 h-12" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Official Accreditation</span>
                  </div>
                )}
                {aff.logoUrl && (
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-sans text-xs font-bold gap-2 backdrop-blur-xs">
                    <ZoomIn className="w-5 h-5 text-gold" /> Click to Expand Certificate
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-primary">{aff.name}</h3>
                  <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">
                    {aff.type || 'Government Approved'}
                  </span>
                </div>
                {aff.description && (
                  <p className="font-sans text-text-secondary text-xs leading-relaxed line-clamp-3">
                    {aff.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && ((activeTab === 'PRESS' && pressItems.length === 0) || (activeTab === 'ACCREDITATIONS' && affiliations.length === 0)) && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No press items or certificates found</p>
          <p className="font-sans text-text-muted text-sm">Check back soon for news updates and official certifications.</p>
        </div>
      )}

      {/* Inline Article iFrame Modal */}
      {activeArticle && (
        <Modal
          isOpen={!!activeArticle}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.publisherName || 'News Article'}
          maxWidth="2xl"
        >
          <div className="flex flex-col gap-5 py-2">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-primary/10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/20">
                {activeArticle.publisherName || 'Susrutha Official Release'}
              </span>
              {activeArticle.articleUrl && (
                <a
                  href={activeArticle.articleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans text-xs font-bold text-gold hover:text-primary transition-colors flex items-center gap-1 shrink-0 bg-gold/10 px-3 py-1.5 rounded-full"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Direct Link
                </a>
              )}
            </div>

            <h2 className="font-display text-3xl font-bold text-primary leading-tight">
              {activeArticle.title}
            </h2>

            {activeArticle.articleUrl ? (
              <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden bg-slate-900 border border-primary/10 shadow-inner">
                <iframe
                  src={activeArticle.articleUrl}
                  title={activeArticle.title}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {activeArticle.summary && (
                  <div className="border-l-4 border-gold bg-primary/5 p-5 rounded-r-2xl font-sans text-base text-primary/90 font-medium italic leading-relaxed shadow-xs">
                    &ldquo;{activeArticle.summary}&rdquo;
                  </div>
                )}
                {activeArticle.content && (
                  <div className="font-sans text-text-secondary text-sm leading-relaxed space-y-3 pt-2">
                    {activeArticle.content.split('\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Lightbox Modal for Certificates */}
      {activeCert && (
        <Modal
          isOpen={!!activeCert}
          onClose={() => setActiveCert(null)}
          title={activeCert.title}
          maxWidth="2xl"
        >
          <div className="flex flex-col gap-4 items-center">
            <div className="relative max-h-[75vh] w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center p-4">
              <img src={activeCert.url} alt={activeCert.title} className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl" />
            </div>
            <div className="flex justify-end w-full">
              <a
                href={activeCert.url}
                download
                target="_blank"
                rel="noreferrer"
                className="font-sans text-xs font-bold text-gold hover:text-primary flex items-center gap-1 bg-gold/10 px-4 py-2 rounded-full transition-colors"
              >
                <Download className="w-4 h-4" /> Download Certificate
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
