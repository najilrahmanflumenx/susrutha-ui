import { redirect } from 'next/navigation';

export default function BlogSlugRedirectPage({ params }: { params: { slug: string } }) {
  redirect(`/journal/${params.slug}`);
}
