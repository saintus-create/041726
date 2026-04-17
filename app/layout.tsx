import type { Metadata } from 'next';
import './global.css';
import { appName } from '@/lib/shared';

export const metadata: Metadata = {
  title: appName,
  description: 'FDA FAERS Pharmacovigilance Analysis',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}