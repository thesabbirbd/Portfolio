import Link from 'next/link';
import { ContentItem } from '@/lib/content';
import { MDXContent } from './MDXContent';

export function ContentLayout({ item, baseUrl, breadcrumbLabel }: { item: ContentItem; baseUrl: string; breadcrumbLabel: string }) {
  const { meta, content } = item;
  
  return (
    <div className="flex flex-col w-full pt-20">
      <div className="container mx-auto px-4 max-w-3xl mb-24">
        <nav className="flex text-sm text-muted-foreground mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link href={baseUrl} className="hover:text-primary transition-colors">{breadcrumbLabel}</Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-foreground truncate max-w-[150px] md:max-w-xs">{meta.title}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              {meta.category || breadcrumbLabel}
            </span>
            <time className="text-sm text-muted-foreground" dateTime={meta.date}>
              {new Date(meta.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{meta.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">{meta.description}</p>
        </header>

        <main className="min-h-[50vh]">
          <MDXContent source={content} />
        </main>
        
        <footer className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-wrap gap-2 mb-8">
            {meta.tags?.map(tag => (
              <span key={tag} className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/80 bg-muted px-3 py-1.5 rounded-md">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 p-6 bg-muted/30 rounded-2xl border border-border/50">
            <img src="/branding/the-sabbir-avatar-180.png" alt="Md Sabbirul Islam Khan" className="w-16 h-16 rounded-full ring-2 ring-primary/20" />
            <div>
              <p className="font-semibold text-lg text-foreground">{meta.author || 'Md Sabbirul Islam Khan'}</p>
              <p className="text-sm text-muted-foreground">Written by THE SABBiR</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
