// Smoke test for /api/chat against a running server.
//
//   node scripts/smoke-chat.mjs [baseUrl]      (default http://localhost:3000)
//
// Makes ONE real model call, then seven malformed requests (each must be a
// 400, and each counts toward the rate limit without spending tokens), then
// checks the next request is a 429. Run at most once a minute per server.

const base = process.argv[2] ?? 'http://localhost:3000';
let failed = 0;

const post = (body) =>
  fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
  if (!ok) failed++;
};

// 1. A real question streams back plain text grounded in the knowledge file.
const started = performance.now();
const res = await post({ messages: [{ role: 'user', text: 'What did you ship at LexTrack AI?' }] });
let text = '';
let firstChunkMs = 0;
if (res.body) {
  const decoder = new TextDecoder();
  for await (const chunk of res.body) {
    if (!firstChunkMs) firstChunkMs = Math.round(performance.now() - started);
    text += decoder.decode(chunk, { stream: true });
  }
}
check('streams a reply', res.status === 200 && text.length > 40, `${res.status}, ${text.length} chars, first chunk ${firstChunkMs} ms`);
check('answer uses LexTrack facts', /99\.5|30 minutes|50\+/.test(text));

// 2. Validation.
const invalid = [
  ['malformed JSON', 'not json'],
  ['no messages', { messages: [] }],
  ['13 messages', { messages: Array.from({ length: 13 }, (_, i) => ({ role: i % 2 ? 'model' : 'user', text: 'hi' })) }],
  ['601-character question', { messages: [{ role: 'user', text: 'a'.repeat(601) }] }],
  ['last turn not from the visitor', { messages: [{ role: 'user', text: 'hi' }, { role: 'model', text: 'hello' }] }],
  ['unknown role', { messages: [{ role: 'system', text: 'hi' }] }],
  ['oversized reply in history', { messages: [{ role: 'user', text: 'hi' }, { role: 'model', text: 'x'.repeat(4001) }, { role: 'user', text: 'hi' }] }],
];
for (const [name, body] of invalid) {
  const r = await post(body);
  check(`400 on ${name}`, r.status === 400, String(r.status));
}

// 3. That was 8 requests this minute; the 9th is rate limited.
const limited = await post({ messages: [{ role: 'user', text: 'hi' }] });
const limitedBody = await limited.json().catch(() => ({}));
check('429 on the 9th request in a minute', limited.status === 429 && limitedBody.error === 'rate_limited', String(limited.status));

process.exit(failed ? 1 : 0);
