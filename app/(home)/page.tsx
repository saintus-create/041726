import Link from 'next/link';
import { getStudyStats } from '@/lib/studies';
import { appName } from '@/lib/shared';

const stats = getStudyStats();

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto py-24 px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">{appName}</h1>
          <p className="text-lg text-gray-500">FDA FAERS Pharmacovigilance Analysis</p>
        </header>
        
        <nav className="space-y-3">
          <Link href="/docs" className="block p-5 border border-gray-200 rounded-lg no-underline text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="font-medium text-base">Overview</div>
            <div className="text-sm text-gray-400 mt-1">{stats.total} records · {stats.yearMin}–{stats.yearMax}</div>
          </Link>
          
          <Link href="/docs/explorer" className="block p-5 border border-gray-200 rounded-lg no-underline text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="font-medium text-base">Explorer</div>
            <div className="text-sm text-gray-400 mt-1">Browse records</div>
          </Link>
          
          <Link href="/docs/methodology" className="block p-5 border border-gray-200 rounded-lg no-underline text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            <div className="font-medium text-base">Methodology</div>
            <div className="text-sm text-gray-400 mt-1">How this site was built</div>
          </Link>
        </nav>
        
        <footer className="mt-16 text-center text-sm text-gray-400">
          Data source: FDA FAERS 2024
        </footer>
      </div>
    </main>
  );
}