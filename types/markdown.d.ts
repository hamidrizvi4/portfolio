// Markdown files are bundled as raw strings (asset/source rule in next.config.mjs).
declare module '*.md' {
  const content: string;
  export default content;
}
