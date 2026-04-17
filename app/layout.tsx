import type { Metadata } from 'next';
import './global.css';
import { appName } from '@/lib/shared';
import { RootProvider } from 'fumadocs-ui/provider/next';

export const metadata: Metadata = {
  title: appName,
  description: 'FDA FAERS Pharmacovigilance Analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><RootProvider>{children}</RootProvider></body>
    </html>
  );
}