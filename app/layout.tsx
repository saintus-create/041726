import type { Metadata } from 'next';
import './global.css';
import { appName } from '@/lib/shared';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: appName,
  description: 'FDA FAERS Pharmacovigilance Analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body><RootProvider>{children}</RootProvider></body>
    </html>
  );
}