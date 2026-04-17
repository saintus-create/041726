import { AIAssistant } from '@/components/ai-assistant';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
}