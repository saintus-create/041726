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
    <div className="flex min-h-screen">
      <nav className="w-56 border-r p-4 bg-gray-50">
        <Link href="/" className="block py-1 text-sm font-medium text-gray-900 mb-4">← Back</Link>
        <Link href="/docs" className="block py-1.5 px-3 text-sm text-gray-600 rounded hover:bg-gray-100">Overview</Link>
        <Link href="/docs/explorer" className="block py-1.5 px-3 text-sm text-gray-600 rounded hover:bg-gray-100">Explorer</Link>
        <Link href="/docs/methodology" className="block py-1.5 px-3 text-sm text-gray-600 rounded hover:bg-gray-100">Methodology</Link>
      </nav>
      <main className="flex-1 max-w-2xl mx-auto py-12 px-8">
        <h1 className="text-2xl font-semibold mb-6">{page.data.title}</h1>
        <MDX components={getMDXComponents({})} />
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