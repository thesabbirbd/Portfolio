import { MDXRemote } from 'next-mdx-remote/rsc';

const components = {
  // Custom components can go here
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4 tracking-tight text-foreground" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mt-8 mb-4 tracking-tight border-b border-border pb-2 text-foreground" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-medium mt-6 mb-3 text-foreground" {...props} />,
  p: (props: any) => <p className="leading-7 mb-6 text-muted-foreground" {...props} />,
  a: (props: any) => <a className="text-primary hover:underline underline-offset-4" {...props} />,
  ul: (props: any) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground" {...props} />,
  ol: (props: any) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground" {...props} />,
  li: (props: any) => <li className="leading-7" {...props} />,
  blockquote: (props: any) => <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground bg-primary/5 py-2 pr-4 rounded-r-lg" {...props} />,
  code: (props: any) => <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" {...props} />,
  pre: (props: any) => <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-zinc-950 p-4 text-white" {...props} />,
};

export function MDXContent({ source }: { source: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80">
      <MDXRemote source={source} components={components} />
    </article>
  );
}
