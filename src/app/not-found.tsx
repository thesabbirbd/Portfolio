import Link from 'next/link';
import { Home, Search, Terminal, FileDown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-[120px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary/50 to-background mb-4">
        404
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Signal Lost</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The requested path does not exist in the current knowledge graph. Try exploring other sections of the system.
      </p>
      
      <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
        <Link href="/" className="flex flex-col items-center p-6 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors group">
          <Home className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <span className="font-semibold text-sm">Return Home</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center p-6 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors group">
          <Search className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <span className="font-semibold text-sm">Search</span>
        </Link>
        <Link href="/projects" className="flex flex-col items-center p-6 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors group">
          <Terminal className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <span className="font-semibold text-sm">Projects</span>
        </Link>
        <Link href="/resume" className="flex flex-col items-center p-6 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors group">
          <FileDown className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
          <span className="font-semibold text-sm">Resume</span>
        </Link>
      </div>
    </div>
  );
}
