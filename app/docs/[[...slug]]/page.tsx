import Link from 'next/link';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getMDXComponents } from '@/components/mdx';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-60 border-r border-gray-100 bg-gray-50/50 p-6">
        <Link href="/" className="block text-sm font-medium text-gray-900 mb-6 hover:text-gray-600">
          ← Home
        </Link>
        <nav className="space-y-1">
          <Link href="/docs" className="block py-2 px-3 text-sm text-gray-600 rounded hover:bg-gray-100 hover:text-gray-900">
            Overview
          </Link>
          <Link href="/docs/explorer" className="block py-2 px-3 text-sm text-gray-600 rounded hover:bg-gray-100 hover:text-gray-900">
            Explorer
          </Link>
          <Link href="/docs/methodology" className="block py-2 px-3 text-sm text-gray-600 rounded hover:bg-gray-100 hover:text-gray-900">
            Methodology
          </Link>
        </nav>
      </aside>
      
      <main className="flex-1 max-w-3xl mx-auto py-12 px-10">
        <article className="prose prose-gray max-w-none">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8 pb-4 border-b border-gray-100">
            {page.data.title}
          </h1>
          <MDX components={getMDXComponents({})} />
        </article>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
  };
}