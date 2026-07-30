'use client';

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Video } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fetchVideos, VideoItem } from '@/lib/api';

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchVideos();
      setVideos(data);
      setLoading(false);
    }
    load();
  }, []);

  const getYoutubeEmbed = (urlOrId?: string) => {
    if (!urlOrId) return '';
    if (urlOrId.includes('youtube.com') || urlOrId.includes('youtu.be')) {
      const match = urlOrId.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : urlOrId;
    }
    return `https://www.youtube.com/embed/${urlOrId}?autoplay=1`;
  };

  const getThumbnail = (item: VideoItem) => {
    if (item.thumbnailUrl) return item.thumbnailUrl;
    if (item.youtubeId) return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
    return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80';
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4" icon={<Video className="w-3.5 h-3.5" />}>
          VIDEO GALLERY
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Susrutha in Motion
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Watch treatment walkthroughs, campus tours, patient testimonials, and Ayurvedic wellness masterclasses from our chief physicians.
        </p>
      </div>

      {/* Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-3xl aspect-[16/9]" />
          ))}
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map((item, idx) => {
            const id = item.id || item._id || `vid-${idx}`;
            return (
              <Card
                key={id}
                variant="default"
                className="flex flex-col group cursor-pointer overflow-hidden p-0 shadow-sm hover:shadow-xl transition-all"
                onClick={() => setActiveVideo(item)}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                  <img
                    src={getThumbnail(item)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {item.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/70 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded">
                      {item.duration}
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-2">
                  {item.category && (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-bronze">
                      {item.category}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-lg text-primary group-hover:text-gold transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-sans text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No videos published yet</p>
          <p className="font-sans text-text-muted text-sm">Check back soon for video walkthroughs & patient stories.</p>
        </div>
      )}

      {/* Video Modal */}
      <Modal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} title={activeVideo?.title || 'Watch Video'}>
        {activeVideo && (
          <div className="flex flex-col gap-4">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black">
              <iframe
                src={getYoutubeEmbed(activeVideo.youtubeId || activeVideo.url)}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {activeVideo.description && (
              <p className="font-sans text-text-secondary text-sm leading-relaxed">
                {activeVideo.description}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
