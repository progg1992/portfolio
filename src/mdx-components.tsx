import type { MDXComponents } from "mdx/types";

// Required by @next/mdx in the App Router. Maps Markdown elements in case study
// bodies to the site's type styles.
const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className="mt-12 text-title font-semibold text-ink" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 text-lg font-semibold text-ink" {...props}>
      {children}
    </h3>
  ),
  p: (props) => <p className="mt-4 text-[17px] leading-relaxed text-muted" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-5 text-muted" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: ({ children, ...props }) => (
    <a className="text-cyan underline underline-offset-4 hover:text-cyan-hover" {...props}>
      {children}
    </a>
  ),
  code: (props) => <code className="font-mono text-sm text-ink" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
