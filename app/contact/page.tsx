import type { Metadata } from 'next';
import { profile } from '@/lib/personal-data';
import PageIntro from '@/components/site/PageIntro';
import ContactForm from '@/components/site/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Email, LinkedIn, and GitHub for Hamid Rizvi. NYU '26, open to Forward Deployed Engineer and AI Engineer roles.",
};

const CHANNELS = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: 'LinkedIn', value: profile.linkedin.replace('https://', ''), href: profile.linkedin, external: true },
  { label: 'GitHub', value: profile.github.replace('https://', ''), href: profile.github, external: true },
  { label: 'Résumé', value: 'PDF', href: profile.resume, external: true },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="[ Contact ]" aside={`[ ${profile.location} ]`} title="Let's talk.">
        <p className="mt-8 max-w-3xl font-display text-[clamp(1.35rem,2.4vw,2.2rem)] leading-[1.2] text-beige">
          {profile.availability}
        </p>
      </PageIntro>

      <div className="container-site mt-16 grid gap-16 md:mt-24 md:grid-cols-12 md:gap-12">
        <section aria-labelledby="direct-label" className="md:col-span-5">
          <h2 id="direct-label" className="label">
            [ Direct ]
          </h2>
          <ul className="mt-6 border-t border-rule">
            {CHANNELS.map((c) => (
              <li key={c.label} className="border-b border-rule">
                <a
                  href={c.href}
                  {...(c.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span className="font-display text-3xl text-beige transition-colors duration-base group-hover:text-burgundy-bright">
                    {c.label}
                  </span>
                  <span className="label min-w-0 truncate normal-case tracking-[0.04em]">
                    {c.value} {c.external ? '↗' : '→'}
                    {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="write-label" className="md:col-span-6 md:col-start-7">
          <h2 id="write-label" className="label">
            [ Write to me ]
          </h2>
          <ContactForm />
        </section>
      </div>
    </>
  );
}
