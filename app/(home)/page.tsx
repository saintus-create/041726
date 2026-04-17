import Link from 'next/link';
import { getStudyStats } from '@/lib/studies';
import { appName } from '@/lib/shared';

const stats = getStudyStats();

export default function HomePage() {
  return (
    <main className="max-w-md mx-auto py-20 px-6 text-center">
      <h1 className="text-3xl font-medium mb-2">{appName}</h1>
      <p className="text-gray-600 mb-8">FDA FAERS Pharmacovigilance Analysis</p>
      <nav className="flex flex-col gap-3">
        <Link href="/docs" className="p-4 border rounded-lg no-underline text-gray-900 hover:bg-gray-50">
          <div className="font-medium">Overview</div>
          <div className="text-sm text-gray-500">{stats.total} records</div>
        </Link>
        <Link href="/docs/explorer" className="p-4 border rounded-lg no-underline text-gray-900 hover:bg-gray-50">
          <div className="font-medium">Explorer</div>
          <div className="text-sm text-gray-500">Browse records</div>
        </Link>
        <Link href="/docs/methodology" className="p-4 border rounded-lg no-underline text-gray-900 hover:bg-gray-50">
          <div className="font-medium">Methodology</div>
          <div className="text-sm text-gray-500">How this site was built</div>
        </Link>
      </nav>
    </main>
  );
}