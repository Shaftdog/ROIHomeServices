'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BOOKING_PATH } from '@/lib/blueprint-config';

/**
 * Floating "ROI Assistant" for the Blueprint page.
 *
 * IT IS NOT ROD. The widget identifies itself as an automated assistant in its
 * header and its opening message, and the backend refuses anything that reads as
 * a valuation opinion (see src/app/api/blueprint/chat/route.ts). Rod is a licensed
 * appraiser; a bot answering "what's it worth" in his name is licensure exposure.
 *
 * When no model is configured the assistant says so plainly and offers a call —
 * it never serves a canned reply as if it had understood the question.
 */

interface ChatTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Assistant turns that are honest system notices rather than model output. */
  isNotice?: boolean;
}

const OPENING_MESSAGE =
  "I'm the ROI Assistant — an automated assistant, not Rod. I can explain what each " +
  'product covers, what it costs, and which one fits your situation. I can’t give ' +
  'property values or ARVs; those come from Rod on an actual engagement.';

const UNCONFIGURED_NOTICE =
  "I'm not connected to an assistant yet, so I can't answer that here — I'd rather say " +
  'so than guess. Rod can answer it directly.';

const NETWORK_NOTICE =
  "I couldn't reach the assistant just now. Booking a call with Rod is the fastest path.";

/** Prompts the visitor can send — these are questions, not pre-written answers. */
const SUGGESTIONS = [
  'Which product should I start with?',
  'How does the process work?',
  'What is the difference between the packages?',
];

export default function BlueprintChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed the opening message once, on first open.
  useEffect(() => {
    if (isOpen && turns.length === 0) {
      setTurns([
        { id: 'opening', role: 'assistant', content: OPENING_MESSAGE, isNotice: true },
      ]);
    }
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, turns.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns, isSending]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || isSending) return;

    const userTurn: ChatTurn = { id: `u-${Date.now()}`, role: 'user', content: question };
    const history = [...turns, userTurn];
    setTurns(history);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/blueprint/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Notices are our own copy, not conversation the model produced.
          messages: history
            .filter((turn) => !turn.isNotice)
            .map((turn) => ({ role: turn.role, content: turn.content })),
        }),
      });

      const data = (await res.json().catch(() => null)) as
        | { configured?: boolean; reply?: string }
        | null;

      if (!res.ok || !data) {
        appendNotice(NETWORK_NOTICE);
        return;
      }

      if (data.configured === false || !data.reply) {
        appendNotice(UNCONFIGURED_NOTICE);
        return;
      }

      setTurns((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: data.reply as string },
      ]);
    } catch {
      appendNotice(NETWORK_NOTICE);
    } finally {
      setIsSending(false);
    }
  }

  function appendNotice(content: string) {
    setTurns((prev) => [
      ...prev,
      { id: `n-${Date.now()}`, role: 'assistant', content, isNotice: true },
    ]);
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-4 z-40 sm:right-6">
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg transition-shadow hover:shadow-xl"
          aria-label="Open the ROI Assistant — automated product help"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="ROI Assistant — automated product help"
      className="fixed bottom-6 right-4 z-40 flex h-[30rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl sm:right-6"
    >
      <header className="flex items-start justify-between gap-2 bg-deep-charcoal p-4 text-white">
        <div>
          <p className="font-semibold">ROI Assistant</p>
          {/* Stated up front, every time: this is not Rod. */}
          <p className="text-xs text-white/70">Automated · not Rod · no valuations</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
          aria-label="Close the ROI Assistant"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </header>

      <div
        ref={scrollRef}
        aria-live="polite"
        className="flex-1 space-y-3 overflow-y-auto p-4"
      >
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={turn.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                turn.role === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-light-gray text-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{turn.content}</p>
              {turn.isNotice && turn.id !== 'opening' && (
                <a
                  href={BOOKING_PATH}
                  className="mt-2 inline-block font-semibold text-accent underline"
                >
                  Book a call with Rod
                </a>
              )}
            </div>
          </div>
        ))}

        {isSending && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            Thinking&hellip;
          </p>
        )}

        {turns.length <= 1 && (
          <div className="space-y-2 pt-2">
            {SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => send(suggestion)}
                className="h-auto w-full justify-start whitespace-normal py-2 text-left text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <label htmlFor="blueprint-chat-input" className="sr-only">
          Ask about the Blueprint products
        </label>
        <Input
          id="blueprint-chat-input"
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about products or pricing…"
          maxLength={2000}
          autoComplete="off"
        />
        <Button type="submit" size="icon" disabled={isSending || !input.trim()} aria-label="Send">
          <Send className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
