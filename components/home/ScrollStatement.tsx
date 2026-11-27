'use client';

/**
 * ScrollStatement.tsx
 *
 * One large first-person statement. Each word starts as --camel-dim at 20%
 * opacity and fills to --beige as the visitor scrolls through the section
 * (scroll-linked, not timed). Each word is the real text (camel-dim) with an
 * aria-hidden beige copy on top whose opacity follows scroll progress, so
 * only opacity animates and screen readers read the text once. Under reduced
 * motion the beige layer is forced visible by CSS.
 *
 * Copy: lib/hamid-knowledge.md, Positioning and Voice (45 words).
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import SectionHeader from './SectionHeader';

const STATEMENT =
  "I'm an AI engineer who works where the model meets the mess: scanned leases, support queues, tax forms, restaurant configs. I find the real constraint first, put a hard wall wherever a wrong answer is expensive, measure every model choice, and write down what broke.";

const WORDS = STATEMENT.split(' ');

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative">
      <span className="text-camel-dim opacity-20 motion-reduce:opacity-0">{word}</span>
      <motion.span aria-hidden="true" className="absolute left-0 top-0 text-beige motion-reduce:!opacity-100" style={{ opacity }}>
        {word}
      </motion.span>
    </span>
  );
}

export default function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });

  return (
    <section aria-labelledby="about-label" className="container-site mt-section">
      <SectionHeader id="about-label" label="[05] About" />
      <p ref={ref} className="mt-10 max-w-6xl font-display text-statement">
        {WORDS.map((word, i) => (
          <span key={i}>
            <Word word={word} progress={scrollYProgress} range={[i / WORDS.length, (i + 1) / WORDS.length]} />
            {i < WORDS.length - 1 && ' '}
          </span>
        ))}
      </p>
    </section>
  );
}
