/**
 * knowledge.ts
 *
 * Server-side access to lib/hamid-knowledge.md, the single source of truth
 * for the AI version of Hamid. Import only from server components and route
 * handlers: the markdown is bundled as a raw string and would otherwise ship
 * to the browser.
 */

import knowledge from './hamid-knowledge.md';

export const KNOWLEDGE: string = knowledge;

export interface SuggestedQuestion {
  question: string;
  /** Pre-written answer shown if the API fails after this chip is clicked. */
  fallback: string;
}

/**
 * Parses the "## Suggested questions" section: each "### " heading is a
 * question chip, and the paragraph under it is that chip's fallback answer.
 */
export function suggestedQuestions(md: string = KNOWLEDGE): SuggestedQuestion[] {
  const start = md.indexOf('\n## Suggested questions');
  if (start === -1) return [];
  const rest = md.slice(start + 1);
  const end = rest.indexOf('\n## ', 1);
  const section = end === -1 ? rest : rest.slice(0, end);

  return section
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const newline = block.indexOf('\n');
      return { question: block.slice(0, newline).trim(), fallback: block.slice(newline + 1).trim() };
    })
    .filter((q) => q.question && q.fallback);
}
