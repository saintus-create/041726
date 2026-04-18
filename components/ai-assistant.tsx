'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: messages 
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('AI request error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'var(--color-fg)',
          color: 'var(--color-bg)',
          border: 'none',
          padding: '10px 16px',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          letterSpacing: '0.01em',
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Ask AI
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      width: 360,
      height: 480,
      background: 'var(--color-bg)',
      border: '1px solid var(--color-border-strong)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-fg)' }}>
          AI Research Assistant
        </span>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-fg-muted)',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Close"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--color-fg-subtle)', fontSize: 'var(--text-sm)', textAlign: 'center', marginTop: 40 }}>
            Ask me anything about the FDA FAERS ADHD stimulant data.
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block',
              maxWidth: '85%',
              padding: '8px 12px',
              fontSize: 'var(--text-sm)',
              background: msg.role === 'user' ? 'var(--color-fg)' : 'var(--color-selection)',
              color: msg.role === 'user' ? 'var(--color-bg)' : 'var(--color-fg)',
              lineHeight: 1.5,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'center', color: 'var(--color-fg-subtle)', fontSize: 'var(--text-sm)' }}>
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the data..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: 'var(--text-sm)',
              border: '1px solid var(--color-border-strong)',
              background: 'var(--color-bg)',
              color: 'var(--color-fg)',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              padding: '8px 14px',
              background: 'var(--color-fg)',
              color: 'var(--color-bg)',
              border: 'none',
              fontSize: 'var(--text-sm)',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !input.trim() ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
