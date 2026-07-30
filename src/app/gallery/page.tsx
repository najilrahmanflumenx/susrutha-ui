'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video as VideoIcon, Play, Sparkles, FolderOpen, ArrowRight } from 'lucide-react';
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

  const API_HOST = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
    .replace(/\/api\/v1\/?$/, '')
    .replace(/\/+$/, '');

  type PlaybackType = 'UPLOADED_VIDEO' | 'YOUTUBE_EMBED' | 'VIMEO_EMBED' | 'DIRECT_MP4_URL' | 'INVALID';

  interface ResolvedVideoPlayback {
    type: PlaybackType;
    srcUrl: string;
    youtubeEmbedUrl?: string;
    vimeoEmbedUrl?: string;
  }

  const extractVideoUrl = (item: VideoItem): string => {
    const candidates = [
      item.videoUrl,
      item.youtubeUrl,
      item.url,
      item.thumbnailUrl,
      item.youtubeId,
    ].filter(Boolean) as string[];

    // 1. Look for uploaded file or MP4 URL candidate first
    const fileCandidate = candidates.find(
      (c) =>
        c.includes('/uploads/') ||
        c.startsWith('blob:') ||
        c.startsWith('data:video') ||
        /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(c)
    );
    if (fileCandidate) return fileCandidate.trim();

    // 2. Look for YouTube URL candidate
    const ytUrlCandidate = candidates.find(
      (c) => c.includes('youtube.com') || c.includes('youtu.be')
    );
    if (ytUrlCandidate) return ytUrlCandidate.trim();

    // 3. Look for Vimeo URL candidate
    const vimeoCandidate = candidates.find((c) => c.includes('vimeo.com'));
    if (vimeoCandidate) return vimeoCandidate.trim();

    // 4. Look for 11-char YouTube ID candidate
    const ytIdCandidate = candidates.find((c) => /^[a-zA-Z0-9_-]{11}$/.test(c.trim()));
    if (ytIdCandidate) return ytIdCandidate.trim();

    // 5. Look for any http/https URL candidate
    const httpCandidate = candidates.find((c) => c.startsWith('http://') || c.startsWith('https://'));
    if (httpCandidate) return httpCandidate.trim();

    return '';
  };

  const resolveVideoPlayback = (item: VideoItem): ResolvedVideoPlayback => {
    const rawUrl = extractVideoUrl(item);

    if (!rawUrl) {
      return { type: 'INVALID', srcUrl: '' };
    }

    // 1. Direct Uploaded Video File (stored in /uploads/ or local storage)
    if (
      rawUrl.includes('/uploads/') ||
      rawUrl.startsWith('blob:') ||
      rawUrl.startsWith('data:video') ||
      /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(rawUrl)
    ) {
      let fullUrl = rawUrl;
      if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://') && !rawUrl.startsWith('blob:')) {
        const cleanPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;
        fullUrl = `${API_HOST}${cleanPath}`;
      }
      return { type: 'UPLOADED_VIDEO', srcUrl: fullUrl };
    }

    // 2. YouTube Video URL or YouTube 11-char ID
    if (rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be')) {
      const match = rawUrl.match(/(?:v=|\/|vi=)([a-zA-Z0-9_-]{11})/);
      if (match) {
        return {
          type: 'YOUTUBE_EMBED',
          srcUrl: rawUrl,
          youtubeEmbedUrl: `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`,
        };
      }
    }

    // Strict 11-character YouTube ID check (e.g. "dQw4w9WgXcQ")
    if (/^[a-zA-Z0-9_-]{11}$/.test(rawUrl)) {
      return {
        type: 'YOUTUBE_EMBED',
        srcUrl: rawUrl,
        youtubeEmbedUrl: `https://www.youtube-nocookie.com/embed/${rawUrl}?autoplay=1&rel=0`,
      };
    }

    // 3. Vimeo Video URL
    if (rawUrl.includes('vimeo.com')) {
      const match = rawUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      if (match) {
        return {
          type: 'VIMEO_EMBED',
          srcUrl: rawUrl,
          vimeoEmbedUrl: `https://player.vimeo.com/video/${match[1]}?autoplay=1`,
        };
      }
    }

    // 4. Any external HTTP / HTTPS MP4 link
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return { type: 'DIRECT_MP4_URL', srcUrl: rawUrl };
    }

    // 5. Fallback for invalid text/slug
    return { type: 'INVALID', srcUrl: rawUrl };
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
              className="flex flex-col justify-between overflow-hidden p-0 border border-primary/10 dark:border-white/10 rounded-3xl shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:-translate-y-2 hover:border-gold/50 transition-all duration-500 group bg-surface-card relative"
            >
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                <img
                  src={
                    item.coverImage ||
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <span className="absolute top-4 left-4 z-10 backdrop-blur-md bg-black/50 text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-gold/30 shadow-md">
                  {item.category || 'Hospital Campus'}
                </span>
              </div>
              <div className="p-6 flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-primary group-hover:text-gold transition-colors duration-300">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-sans text-text-secondary text-sm leading-relaxed line-clamp-2 mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="pt-4 mt-2 border-t border-primary/10 flex items-center justify-between text-xs font-bold font-sans text-gold group-hover:text-amber-600 transition-colors">
                  <span>View Photo Gallery</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video Gallery Grid */}
      {!loading && activeTab === 'VIDEOS' && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((item, idx) => {
            const playback = resolveVideoPlayback(item);
            const thumb =
              item.thumbnailUrl ||
              (playback.type === 'YOUTUBE_EMBED' && item.youtubeId ? `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg` : '') ||
              'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80';

            return (
              <Card
                key={item.id || item._id || idx}
                variant="default"
                className="flex flex-col justify-between overflow-hidden p-0 border border-primary/10 dark:border-white/10 rounded-3xl shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:-translate-y-2 hover:border-gold/60 transition-all duration-500 cursor-pointer group bg-surface-card relative"
                onClick={() => setActiveVideo(item)}
              >
                <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden flex items-center justify-center">
                  {playback.type === 'UPLOADED_VIDEO' || playback.type === 'DIRECT_MP4_URL' ? (
                    <video
                      src={playback.srcUrl}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={thumb}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    />
                  )}
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

                  {/* Pulsing Animated Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-16 h-16 rounded-full bg-gold/30 animate-ping opacity-75 group-hover:opacity-100" />
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold via-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.6)] group-hover:scale-115 group-hover:shadow-[0_15px_40px_rgba(212,175,55,0.8)] transition-all duration-300">
                        <Play className="w-6 h-6 fill-white text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Category / Host Badge */}
                  <span className="absolute top-4 left-4 z-10 backdrop-blur-md bg-black/50 text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-gold/30 shadow-md">
                    {item.category ? item.category.replace('_', ' ') : 'Video Walkthrough'}
                  </span>

                  {item.duration && (
                    <span className="absolute bottom-4 right-4 z-10 backdrop-blur-md bg-black/60 text-white text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md border border-white/20">
                      {item.duration}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <h3 className="font-display text-xl font-bold text-primary group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="font-sans text-text-secondary text-xs leading-relaxed line-clamp-2 mt-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-4 mt-2 border-t border-primary/10 flex items-center justify-between text-xs font-bold font-sans text-gold group-hover:text-amber-600 transition-colors">
                    <span>Watch Video Clip</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
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
      {activeVideo && (() => {
        const playback = resolveVideoPlayback(activeVideo);
        return (
          <Modal
            isOpen={!!activeVideo}
            onClose={() => setActiveVideo(null)}
            title={activeVideo.title}
            maxWidth="2xl"
          >
            <div className="flex flex-col gap-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center">
                {playback.type === 'UPLOADED_VIDEO' || playback.type === 'DIRECT_MP4_URL' ? (
                  <video
                    src={playback.srcUrl}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain bg-black"
                  />
                ) : playback.type === 'YOUTUBE_EMBED' ? (
                  <iframe
                    src={playback.youtubeEmbedUrl}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : playback.type === 'VIMEO_EMBED' ? (
                  <iframe
                    src={playback.vimeoEmbedUrl}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center gap-3 bg-surface-card text-text-secondary w-full h-full">
                    <VideoIcon className="w-12 h-12 text-gold opacity-60" />
                    <div>
                      <h4 className="font-display text-lg font-bold text-primary mb-1">
                        Video Media Unavailable
                      </h4>
                      <p className="font-sans text-xs text-text-muted max-w-md">
                        This video record does not have a valid uploaded MP4 file or YouTube URL attached. Please configure the video link in the Admin CMS.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {activeVideo.description && (
                <p className="font-sans text-text-secondary text-sm leading-relaxed p-2">
                  {activeVideo.description}
                </p>
              )}
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
