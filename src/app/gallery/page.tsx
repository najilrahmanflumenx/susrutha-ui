'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video as VideoIcon, Play, Sparkles, FolderOpen } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fetchGalleryAlbums, fetchVideos, AlbumItem, VideoItem } from '@/lib/api';

export default function PublicGalleryPage() {
  const [activeTab, setActiveTab] = useState<'PHOTOS' | 'VIDEOS'>('PHOTOS');
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (activeTab === 'PHOTOS') {
        const data = await fetchGalleryAlbums();
        setAlbums(data);
      } else {
        const data = await fetchVideos();
        setVideos(data);
      }
      setLoading(false);
    }
    load();
  }, [activeTab]);

  const getYoutubeEmbed = (urlOrId?: string) => {
    if (!urlOrId) return '';
    if (urlOrId.includes('youtube.com') || urlOrId.includes('youtu.be')) {
      const match = urlOrId.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : urlOrId;
    }
    return `https://www.youtube.com/embed/${urlOrId}?autoplay=1`;
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <Badge variant="gold" className="mb-4" icon={<ImageIcon className="w-3.5 h-3.5" />}>
          VISUAL SANCTUARY & MEDIA GALLERY
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Susrutha in Motion & Pictures
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Explore campus photos, inpatient suites, Panchakarma therapy walk-throughs, and video masterclasses from our chief physicians.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center items-center gap-3">
        <Chip
          active={activeTab === 'PHOTOS'}
          onClick={() => setActiveTab('PHOTOS')}
        >
          Photo Albums
        </Chip>
        <Chip
          active={activeTab === 'VIDEOS'}
          onClick={() => setActiveTab('VIDEOS')}
        >
          Video Walkthroughs
        </Chip>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-3xl aspect-[16/10]" />
          ))}
        </div>
      )}

      {/* Photo Albums Grid */}
      {!loading && activeTab === 'PHOTOS' && albums.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((item, idx) => (
            <Card
              key={item.id || item._id || idx}
              variant="default"
              className="flex flex-col justify-between overflow-hidden p-0 border border-primary/10 shadow-md hover:shadow-xl transition-all group"
            >
              <div className="relative aspect-[16/10] bg-primary/5 overflow-hidden">
                <img
                  src={
                    item.coverImage ||
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-primary/90 text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/30 backdrop-blur-md">
                  {item.category || 'Hospital Campus'}
                </span>
              </div>
              <div className="p-6 flex flex-col gap-2">
                <h3 className="font-display text-2xl font-bold text-primary group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="font-sans text-text-secondary text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video Gallery Grid */}
      {!loading && activeTab === 'VIDEOS' && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((item, idx) => {
            const thumb =
              item.thumbnailUrl ||
              (item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : '') ||
              'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80';

            return (
              <Card
                key={item.id || item._id || idx}
                variant="default"
                className="flex flex-col justify-between overflow-hidden p-0 border border-primary/10 shadow-md hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setActiveVideo(item)}
              >
                <div className="relative aspect-[16/9] bg-primary/10 overflow-hidden">
                  {(thumb && (thumb.includes('.mp4') || thumb.includes('.webm') || thumb.includes('.mov'))) ||
                  (item.videoUrl && (item.videoUrl.includes('.mp4') || item.videoUrl.includes('.webm'))) ? (
                    <video
                      src={item.videoUrl || thumb}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={thumb}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/20 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-gold text-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-2">
                  <h3 className="font-display text-xl font-bold text-primary group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-sans text-text-secondary text-xs leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && ((activeTab === 'PHOTOS' && albums.length === 0) || (activeTab === 'VIDEOS' && videos.length === 0)) && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No media published yet</p>
          <p className="font-sans text-text-muted text-sm">Check back soon for new photo albums and video walk-throughs.</p>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
        <Modal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
          maxWidth="2xl"
        >
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
              {(activeVideo.videoUrl && (activeVideo.videoUrl.includes('.mp4') || activeVideo.videoUrl.includes('.webm') || activeVideo.videoUrl.includes('.mov'))) ||
              (activeVideo.thumbnailUrl && (activeVideo.thumbnailUrl.includes('.mp4') || activeVideo.thumbnailUrl.includes('.webm'))) ? (
                <video
                  src={activeVideo.videoUrl || activeVideo.thumbnailUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={getYoutubeEmbed(activeVideo.youtubeId || activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            {activeVideo.description && (
              <p className="font-sans text-text-secondary text-sm leading-relaxed p-2">
                {activeVideo.description}
              </p>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
