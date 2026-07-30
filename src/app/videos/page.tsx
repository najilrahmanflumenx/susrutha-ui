'use client';

import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Video, ArrowRight } from 'lucide-react';
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

    if (/^[a-zA-Z0-9_-]{11}$/.test(rawUrl)) {
      return {
        type: 'YOUTUBE_EMBED',
        srcUrl: rawUrl,
        youtubeEmbedUrl: `https://www.youtube-nocookie.com/embed/${rawUrl}?autoplay=1&rel=0`,
      };
    }

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

    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      return { type: 'DIRECT_MP4_URL', srcUrl: rawUrl };
    }

    return { type: 'INVALID', srcUrl: rawUrl };
  };

  const getThumbnail = (item: VideoItem) => {
    if (item.thumbnailUrl) return item.thumbnailUrl;
    if (item.youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(item.youtubeId)) {
      return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
    }
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
            const playback = resolveVideoPlayback(item);
            return (
              <Card
                key={id}
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
                      src={getThumbnail(item)}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    />
                  )}
                  {/* Dark Gradient Overlay */}
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

                  {item.category && (
                    <span className="absolute top-4 left-4 z-10 backdrop-blur-md bg-black/50 text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-gold/30 shadow-md">
                      {item.category.replace('_', ' ')}
                    </span>
                  )}

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

      {!loading && videos.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No videos published yet</p>
          <p className="font-sans text-text-muted text-sm">Check back soon for video walkthroughs & patient stories.</p>
        </div>
      )}

      {/* Video Modal */}
      <Modal isOpen={!!activeVideo} onClose={() => setActiveVideo(null)} title={activeVideo?.title || 'Watch Video'}>
        {activeVideo && (() => {
          const playback = resolveVideoPlayback(activeVideo);
          return (
            <div className="flex flex-col gap-4">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
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
                    <Video className="w-12 h-12 text-gold opacity-60" />
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
                <p className="font-sans text-text-secondary text-sm leading-relaxed">
                  {activeVideo.description}
                </p>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
