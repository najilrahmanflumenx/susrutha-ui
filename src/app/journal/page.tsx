'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, ChevronLeft, ChevronRight, Sparkles, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Chip } from '@/components/ui/Badge';
import { fetchBlogs, BlogItem } from '@/lib/api';

function BlogCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-4 rounded-3xl bg-surface-card border border-primary/10 p-6">
      <div className="aspect-[16/9] rounded-2xl bg-primary/10" />
      <div className="h-3 w-24 rounded-full bg-primary/10" />
      <div className="h-6 w-4/5 rounded-full bg-primary/10" />
      <div className="h-4 w-full rounded-full bg-primary/10" />
      <div className="h-4 w-3/4 rounded-full bg-primary/10" />
    </div>
  );
}

export default function JournalPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 9;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchBlogs({ page, limit: itemsPerPage, category: selectedFilter });
        setBlogs(res.data);
        setTotalPages(res.meta?.totalPages || 1);
        setTotalCount(res.meta?.total || res.data.length);
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, selectedFilter]);

  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    blogs.forEach((b) => {
      const c = (b.category || '').trim();
      if (c) cats.set(c.toLowerCase(), c.charAt(0).toUpperCase() + c.slice(1));
    });
    return ['ALL', ...Array.from(cats.values())];
  }, [blogs]);

  const handleFilter = (cat: string) => {
    setSelectedFilter(cat);
    setPage(1);
  };

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-7xl mx-auto flex flex-col gap-12 pb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8">
        <Badge variant="gold" className="mb-4" icon={<BookOpen className="w-3.5 h-3.5" />}>
          AYURVEDIC WISDOM & INSIGHTS
        </Badge>
        <h1 className="font-display text-4xl sm:text-6xl font-semibold text-primary mb-6">
          The Susrutha Journal
        </h1>
        <p className="font-sans text-text-secondary text-base leading-relaxed">
          Explore research-backed Ayurvedic insights, treatment guides, healing stories, and ancient wisdom curated by our senior physicians.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center items-center gap-3 flex-wrap">
        {categories.map((cat) => (
          <Chip
            key={cat}
            active={selectedFilter.toLowerCase() === cat.toLowerCase()}
            onClick={() => handleFilter(cat)}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => <BlogCardSkeleton key={i} />)}
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <div className="flex justify-between items-center border-b border-primary/10 pb-4">
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-bronze">
            {totalCount} Articles
          </span>
          <span className="text-xs font-sans text-text-muted">
            Page {page} of {totalPages}
          </span>
        </div>
      )}

      {/* Blog Grid */}
      {!loading && blogs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog, idx) => {
            const id = blog.id || blog._id || `blog-${idx}`;
            const slug = blog.slug || id;
            const date = blog.publishedAt
              ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
              : '';
            return (
              <Card key={id} variant="default" className="flex flex-col group border border-primary/10 dark:border-white/10 rounded-3xl shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:-translate-y-2 hover:border-gold/50 transition-all duration-500 overflow-hidden p-0 bg-surface-card relative">
                {/* Cover image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5 aspect-[16/9]">
                      <span className="text-text-muted text-xs font-sans">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  {blog.category && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="backdrop-blur-md bg-black/50 text-gold text-[10px] font-sans font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-gold/30 shadow-md">
                        {blog.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-6 flex-1 justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-text-muted">
                      {date && <span>{date}</span>}
                      {blog.readTime && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gold" /> {blog.readTime} min read
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary group-hover:text-gold transition-colors duration-300 leading-snug line-clamp-2">
                      <Link href={`/journal/${slug}`}>
                        {blog.title}
                      </Link>
                    </h3>
                    {blog.excerpt && (
                      <p className="font-sans text-text-secondary text-sm leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between text-xs font-bold font-sans text-gold group-hover:text-amber-600 transition-colors">
                    <Link href={`/journal/${slug}`} className="flex items-center justify-between w-full">
                      <span>Read Full Article</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && blogs.length === 0 && (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">No articles yet</p>
          <p className="font-sans text-text-muted text-sm">Check back soon for Ayurvedic wisdom & insights.</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8 border-t border-primary/10">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} icon={<ChevronLeft className="w-4 h-4" />}>
            PREV
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg font-sans text-xs font-bold transition-all ${
                page === i + 1 ? 'bg-gold text-white shadow-md' : 'bg-surface-card text-primary border border-primary/10 hover:bg-primary/5'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} icon={<ChevronRight className="w-4 h-4" />}>
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
}
