'use client';

/**
 * ContactForm.tsx
 *
 * A short form that hands off to the visitor's email app: nothing is sent
 * from this site, so there is no backend, key, or spam surface. With
 * JavaScript, submit composes a mailto: link with a subject and body; without
 * it, the native mailto form action still opens the mail client.
 */

import { useState } from 'react';
import { profile } from '@/lib/personal-data';

const FIELD =
  'mt-2 w-full rounded-none border border-rule bg-ink-2 px-4 py-3 text-lg text-beige placeholder:text-camel-dim hover:bg-ink-3 focus:bg-ink-3';

export default function ContactForm() {
  const [opened, setOpened] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const field = (name: string) => String(form.get(name) ?? '').trim();
    const subject = `Hello from ${field('name')}`;
    const body = `${field('message')}\n\n${field('name')}\n${field('email')}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <form action={`mailto:${profile.email}`} method="post" encType="text/plain" onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
      <label className="block">
        <span className="label">Name</span>
        <input name="name" required autoComplete="name" className={FIELD} />
      </label>
      <label className="block">
        <span className="label">Your email</span>
        <input name="email" type="email" required autoComplete="email" className={FIELD} />
      </label>
      <label className="block">
        <span className="label">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={1500}
          placeholder="The workflow, the constraint, and what a wrong answer costs."
          className={`${FIELD} resize-y`}
        />
      </label>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="rounded-full bg-beige px-6 py-3 text-ink transition-colors duration-base hover:bg-burgundy-bright hover:text-beige"
        >
          Open in my email app →
        </button>
        <p className="text-sm text-camel">Nothing is sent from this site; your email app opens with the message filled in.</p>
      </div>
      <p role="status" aria-live="polite" className="text-sm text-beige">
        {opened && `If your email app didn't open, write to ${profile.email}.`}
      </p>
    </form>
  );
}
