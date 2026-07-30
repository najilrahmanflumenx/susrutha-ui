'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video as VideoIcon, Play, Sparkles, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, Chip } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { fetchGalleryAlbums, fetchVideos, AlbumItem, VideoItem } from '@/lib/api';
import { KOWDIAR_GALLERY_PHOTOS, GalleryPhotoItem } from '@/data/susruthaData';

export default function PublicGalleryPage() {
  const [activeTab, setActiveTab] = useState<'PHOTOS' | 'VIDEOS'>('PHOTOS');
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [photos, setPhotos] = useState<GalleryPhotoItem[]>(KOWDIAR_GALLERY_PHOTOS);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  
  // Lightbox State for Full-Screen Image Viewing
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (activeTab === 'PHOTOS') {
        const albumData = await fetchGalleryAlbums();
        setAlbums(albumData);

        // Collect all photos from API albums
        const apiPhotos: GalleryPhotoItem[] = [];
        albumData.forEach((alb: any) => {
          if (alb.photos && Array.isArray(alb.photos) && alb.photos.length > 0) {
            alb.photos.forEach((p: any, idx: number) => {
              apiPhotos.push({
                id: p._id || `${alb.id || 'alb'}-${idx}`,
                title: p.title || `${alb.title || 'Photo'} #${idx + 1}`,
                largeUrl: p.imageUrl || p.thumbnailUrl || '',
                smallUrl: p.thumbnailUrl || p.imageUrl || '',
                album: alb.title || 'Photo Gallery',
              });
            });
          }
        });

        // Use API photos if available, else fall back to full 36 Kowdiar photos
        if (apiPhotos.length > 0) {
          setPhotos(apiPhotos);
        } else {
          setPhotos(KOWDIAR_GALLERY_PHOTOS);
        }
      } else {
        const videoData = await fetchVideos();
        setVideos(videoData);
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

    const fileCandidate = candidates.find(
      (c) =>
        c.includes('/uploads/') ||
        c.startsWith('blob:') ||
        c.startsWith('data:video') ||
        /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(c)
    );
    if (fileCandidate) return fileCandidate.trim();

    const ytUrlCandidate = candidates.find(
      (c) => c.includes('youtube.com') || c.includes('youtu.be')
    );
    if (ytUrlCandidate) return ytUrlCandidate.trim();

    const vimeoCandidate = candidates.find((c) => c.includes('vimeo.com'));
    if (vimeoCandidate) return vimeoCandidate.trim();

    const ytIdCandidate = candidates.find((c) => /^[a-zA-Z0-9_-]{11}$/.test(c.trim()));
    if (ytIdCandidate) return ytIdCandidate.trim();

    const httpCandidate = candidates.find((c) => c.startsWith('http://') || c.startsWith('https://'));
    if (httpCandidate) return httpCandidate.trim();

    return '';
  };

  const resolveVideoPlayback = (item: VideoItem): ResolvedVideoPlayback => {
    const rawUrl = extractVideoUrl(item);
    if (!rawUrl) return { type: 'INVALID', srcUrl: '' };

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

  const handlePrevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pt-32 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
        <Badge variant="gold" className="mb-4" icon={<ImageIcon className="w-3.5 h-3.5" />}>
          VISUAL SANCTUARY & MEDIA GALLERY
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          Susrutha Photo & Video Gallery
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Explore campus photos, Kowdiar center inauguration highlights, Panchakarma therapy suites, and clinical video walk-throughs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center items-center gap-3">
        <Chip
          active={activeTab === 'PHOTOS'}
          onClick={() => setActiveTab('PHOTOS')}
        >
          Photo Gallery ({photos.length})
        </Chip>
        <Chip
          active={activeTab === 'VIDEOS'}
          onClick={() => setActiveTab('VIDEOS')}
        >
          Video Walkthroughs ({videos.length})
        </Chip>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-surface-card border border-primary/10 rounded-2xl aspect-square" />
          ))}
        </div>
      )}

      {/* Direct Interactive Photo Grid */}
      {!loading && activeTab === 'PHOTOS' && photos.length > 0 && (
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold text-primary">
              Kowdiar Center Inauguration Gallery
            </h3>
            <span className="text-xs font-sans text-text-muted">
              Showing {photos.length} High-Resolution Photos
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {photos.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-primary/10 bg-slate-950 shadow-md hover:shadow-2xl hover:border-gold/60 transition-all duration-300"
              >
                <img
                  src={item.smallUrl || item.largeUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-cream text-xs font-bold font-sans line-clamp-1">{item.title}</span>
                  <div className="flex items-center gap-1 text-gold text-[10px] font-sans mt-1">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Click to view full photo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              '/images/old_site/kowdiar/video-poster.jpg';

            return (
              <Card
                key={item.id || item._id || idx}
                variant="default"
                className="flex flex-col justify-between overflow-hidden p-0 border border-primary/10 rounded-3xl shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] hover:-translate-y-2 hover:border-gold/60 transition-all duration-500 cursor-pointer group bg-surface-card relative"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="relative flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold via-amber-500 to-yellow-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-white text-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <span className="absolute top-4 left-4 z-10 backdrop-blur-md bg-black/50 text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-gold/30">
                    {item.category ? item.category.replace('_', ' ') : 'Video Walkthrough'}
                  </span>
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
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && ((activeTab === 'PHOTOS' && photos.length === 0) || (activeTab === 'VIDEOS' && videos.length === 0)) && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No media published yet</p>
        </div>
      )}

      {/* Full-Screen Lightbox Modal for Photo Gallery */}
      {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between z-10">
            <span className="text-cream/80 text-xs font-mono">
              Photo {selectedPhotoIndex + 1} of {photos.length}
            </span>
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-cream transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Image Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-black/60 hover:bg-gold/80 text-white transition-colors border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={photos[selectedPhotoIndex].largeUrl || photos[selectedPhotoIndex].smallUrl}
              alt={photos[selectedPhotoIndex].title}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-all duration-300"
            />

            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-black/60 hover:bg-gold/80 text-white transition-colors border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Footer Caption */}
          <div className="text-center z-10">
            <h4 className="font-display text-lg font-bold text-cream">
              {photos[selectedPhotoIndex].title}
            </h4>
            <span className="text-gold text-xs font-sans">
              {photos[selectedPhotoIndex].album}
            </span>
          </div>
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
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center gap-3 bg-surface-card text-text-secondary w-full h-full">
                    <VideoIcon className="w-12 h-12 text-gold opacity-60" />
                    <div>
                      <h4 className="font-display text-lg font-bold text-primary mb-1">
                        Video Media Unavailable
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
