'use client';

import { useEffect, useState } from 'react';
import { Breadcrumbs, CardLink, PageHero } from '../../components/ui';
import { pageTitle } from '../../lib/seo';
import { getBlogs } from '../../lib/api';

export default function KnowledgePage() {
  const [articleList, setArticleList] = useState<any[]>([]);

  useEffect(() => {
    document.title = pageTitle('Knowledge Centre');
    getBlogs().then((blogs) => {
      if (blogs && Array.isArray(blogs) && blogs.length > 0) {
        const mapped = blogs.map((b: any) => ({
          id: b._id || b.slug,
          slug: b.slug,
          title: b.title,
          excerpt: b.excerpt,
          meta: `${b.readTimeMinutes || 5} min read · ${b.authorName || 'Susrutha Medical Team'}`,
        }));
        setArticleList(mapped);
      }
    });
  }, []);

  return (
    <div>
      <PageHero
        eyebrow="Knowledge Centre"
        title="Clinical writing with accountable bylines"
        description="Pillar articles for patients and answer engines — AI summaries, takeaways, FAQs and doctor attribution."
      />
      <div className="container-wide section-pad py-12">
        <Breadcrumbs items={[{ label: 'Knowledge Centre' }]} />
        {articleList.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {articleList.map((a) => (
              <CardLink
                key={a.id}
                to={`/knowledge/${a.slug}`}
                title={a.title}
                description={a.excerpt}
                meta={a.meta}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sus-green/10 bg-white p-8 text-center">
            <h2 className="font-display text-xl text-sus-green-deep">No Articles Published</h2>
            <p className="mt-2 text-sm text-sus-muted">No knowledge articles are currently published in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}

