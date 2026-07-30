'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchBlogBySlug, BlogItem } from '@/lib/api';

function BlogDetailSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="h-5 w-24 rounded-full bg-primary/10" />
      <div className="h-10 w-3/4 rounded-xl bg-primary/10" />
      <div className="h-4 w-48 rounded-full bg-primary/10" />
      <div className="aspect-[16/9] rounded-3xl bg-primary/10" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`h-4 rounded-full bg-primary/10 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  );
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function load() {
      setLoading(true);
      const data = await fetchBlogBySlug(slug);
      setBlog(data);
      setLoading(false);
    }
    load();
  }, [slug]);

  return (
    <div className="px-6 sm:px-12 md:px-20 max-w-4xl mx-auto pb-24">
      {/* Back */}
      <div className="pt-8 mb-8">
        <Link href="/journal">
          <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            BACK TO JOURNAL
          </Button>
        </Link>
      </div>

      {loading && <BlogDetailSkeleton />}

      {!loading && !blog && (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-gold opacity-40" />
          <p className="font-display text-2xl text-primary/50">Article not found</p>
          <Link href="/journal">
            <Button variant="gold">Browse Journal</Button>
          </Link>
        </div>
      )}

      {!loading && blog && (
        <article className="flex flex-col gap-8">
          {/* Meta */}
          <div className="flex flex-col gap-4">
            {blog.category && (
              <div>
                <Badge variant="gold" icon={<Tag className="w-3 h-3" />}>{blog.category}</Badge>
              </div>
            )}
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-primary leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-sans font-semibold uppercase tracking-widest text-text-muted">
              {blog.author && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> {blog.author}
                </span>
              )}
              {blog.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(blog.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              {blog.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {blog.readTime} min read
                </span>
              )}
            </div>
          </div>

          {/* Cover */}
          <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-xl">
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                <span className="text-text-muted text-sm font-sans">No image</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/5 text-primary text-[11px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="font-sans text-lg text-text-secondary leading-relaxed border-l-4 border-gold pl-6 italic">
              {blog.excerpt}
            </p>
          )}

          {/* Content */}
          {blog.content ? (
            <div
              className="font-sans text-text-secondary leading-relaxed text-base prose prose-headings:font-display prose-headings:text-primary prose-strong:text-primary max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <p className="font-sans text-text-muted italic text-center py-8">Full article content coming soon.</p>
          )}

          {/* CTA */}
          <div className="mt-8 p-8 rounded-3xl bg-primary text-surface text-center flex flex-col items-center gap-4">
            <Sparkles className="w-8 h-8 text-gold" />
            <h3 className="font-display text-2xl font-bold">Begin Your Healing Journey</h3>
            <p className="font-sans text-sm text-surface/70 max-w-sm">
              Consult our senior Ayurvedic physicians to understand the right treatments for your body constitution.
            </p>
            <Link href="/booking">
              <Button variant="gold">BOOK A CONSULTATION</Button>
            </Link>
          </div>
        </article>
      )}
    </div>
  );
}
