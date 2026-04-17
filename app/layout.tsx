import type { Metadata } from 'next';
import './global.css';
import { appName } from '@/lib/shared';

export const metadata: Metadata = {
  title: appName,
  description: 'FDA FAERS Pharmacovigilance Analysis',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}