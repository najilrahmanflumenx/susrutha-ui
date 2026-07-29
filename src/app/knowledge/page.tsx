'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, CardLink, PageHero, Pagination, SkeletonCard } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getBlogs } from '../../lib/api';
import { articles as staticArticles } from '../../data/content';

const ITEMS_PER_PAGE = 6;

export default function KnowledgePage() {
  const [articleList, setArticleList] = useState<any[]>(
    staticArticles.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      meta: `${a.readTime} · Susrutha Medical Team`,
    }))
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = pageTitle('Knowledge Centre');
    setLoading(true);
    getBlogs()
      .then((blogs) => {
        if (blogs && Array.isArray(blogs) && blogs.length > 0) {
          const mapped = blogs.map((b: any) => ({
            id: b._id || b.slug,
            slug: b.slug,
            title: b.title,
            excerpt: b.excerpt || b.summary,
            meta: `${b.readTimeMinutes || 5} min read · ${b.authorName || 'Susrutha Medical Team'}`,
          }));
          setArticleList(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(articleList.length / ITEMS_PER_PAGE);
  const paginatedArticles = articleList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="bg-[#120A0B] min-h-screen text-ivory-50 font-body">
      <PageHero
        eyebrow="Knowledge Centre"
        title="Clinical writing with accountable bylines"
        description="Pillar articles for patients and answer engines — AI summaries, takeaways, FAQs and doctor attribution."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Knowledge Centre' }]} />

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 my-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : paginatedArticles.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 my-6">
              {paginatedArticles.map((a) => (
                <CardLink
                  key={a.id}
                  to={`/knowledge/${a.slug}`}
                  title={a.title}
                  description={a.excerpt}
                  meta={a.meta}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-ochre/30 bg-[#1C1214]/95 p-8 text-center shadow-glass-dark text-ivory-50 font-body">
            <h2 className="font-display text-xl text-white font-bold">No Articles Published</h2>
            <p className="mt-2 text-sm text-ivory-200/90">No knowledge articles are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}

