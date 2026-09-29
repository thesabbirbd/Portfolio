import Link from 'next/link';
import { ContentItem, getAllContent } from '@/lib/content';
import { Network, ArrowRight, Tag, Activity } from 'lucide-react';

export function ConnectedKnowledge({ meta }: { meta: ContentItem['meta'], }) {
  // 1. Gather all content
  const allProjects = getAllContent('projects').map(c => ({ ...c, _type: 'projects' }));
  const allNotes = getAllContent('notes').map(c => ({ ...c, _type: 'notes' }));
  const allLab = getAllContent('lab').map(c => ({ ...c, _type: 'lab' }));
  const allJournal = getAllContent('journal').map(c => ({ ...c, _type: 'journal' }));
  
  const globalContent = [...allProjects, ...allNotes, ...allLab, ...allJournal];

  
  const currentTypeInferred = globalContent.find(c => c.meta.slug === meta.slug)?._type || 'notes';


  // 2. Explicit Relationships (Forward)
  const explicitSlugs = [
    ...(meta.relatedProjects || []),
    ...(meta.relatedNotes || []),
    ...(meta.relatedLab || []),
    ...(meta.relatedJournal || [])
  ];

  const explicitContent = globalContent.filter(c => explicitSlugs.includes(c.meta.slug) && c.meta.slug !== meta.slug);

  // 3. Backlinks (Items pointing to this item)
  const backlinks = globalContent.filter(c => {
    if (c.meta.slug === meta.slug) return false;
    const theirRefs = [
      ...(c.meta.relatedProjects || []),
      ...(c.meta.relatedNotes || []),
      ...(c.meta.relatedLab || []),
      ...(c.meta.relatedJournal || [])
    ];
    return theirRefs.includes(meta.slug);
  });

  // 4. Implicit (Shared technologies or tags)
  // Find items sharing at least 1 technology or 2 tags
  const myTechs = meta.technologies || [];
  const myTags = meta.tags || [];
  
  const implicitConnections = globalContent
    .filter(c => c.meta.slug !== meta.slug)
    .filter(c => !explicitContent.some(e => e.meta.slug === c.meta.slug))
    .filter(c => !backlinks.some(b => b.meta.slug === c.meta.slug))
    .map(c => {
      const theirTechs = c.meta.technologies || [];
      const theirTags = c.meta.tags || [];
      
      const sharedTechs = myTechs.filter(t => theirTechs.includes(t));
      const sharedTags = myTags.filter(t => theirTags.includes(t));
      
      const strength = sharedTechs.length * 2 + sharedTags.length;
      return { item: c, strength, shared: [...sharedTechs, ...sharedTags] };
    })
    .filter(c => c.strength >= 2)
    .sort((a, b) => b.strength - a.strength)
    .slice(0, 4); // Limit to top 4 implicit to avoid clutter

  
  // 5. Chronological Neighbors (Same Type)
  const sameTypeContent = globalContent
    .filter(c => c._type === currentTypeInferred)
    .sort((a, b) => new Date(a.meta.date).getTime() - new Date(b.meta.date).getTime());
    
  const myIndex = sameTypeContent.findIndex(c => c.meta.slug === meta.slug);
  let nextItem = null;
  let prevItem = null;
  
  if (myIndex > 0) prevItem = sameTypeContent[myIndex - 1];
  if (myIndex !== -1 && myIndex < sameTypeContent.length - 1) nextItem = sameTypeContent[myIndex + 1];


  const hasAnyConnections = explicitContent.length > 0 || backlinks.length > 0 || implicitConnections.length > 0 || prevItem || nextItem;

  if (!hasAnyConnections) return null;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'projects': return 'Project';
      case 'notes': return 'Note';
      case 'lab': return 'Lab';
      case 'journal': return 'Journal';
      default: return 'Content';
    }
  };

  const getBasePath = (type: string) => {
    if (type === 'lab') return '/engineering-lab';
    return `/${type}`;
  };

  return (
    <div className="mt-20 pt-12 border-t border-border/50 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-muted-foreground flex items-center gap-2">
        <Network className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Knowledge Graph</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Explicit Connections */}
        {(explicitContent.length > 0 || backlinks.length > 0) && (
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Direct References
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...explicitContent, ...backlinks].map((item, idx) => {
                // Deduplicate if an item is both explicit and a backlink
                if (idx > 0 && [...explicitContent, ...backlinks].findIndex(i => i.meta.slug === item.meta.slug) !== idx) return null;
                
                return (
                  <Link 
                    key={item.meta.slug} 
                    href={`${getBasePath(item._type)}/${item.meta.slug}`}
                    className="group flex flex-col p-4 rounded-xl border border-border/50 bg-zinc-950/40 backdrop-blur-md hover:bg-zinc-900/60 hover:border-border/80 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {getTypeLabel(item._type)}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </div>
                    <span className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">
                      {item.meta.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        
        {/* Chronological Navigation */}
        {(prevItem || nextItem) && (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" /> Timeline
            </h4>
            <div className="flex flex-col gap-3">
              {prevItem && (
                <Link 
                  href={`${getBasePath(prevItem._type)}/${prevItem.meta.slug}`}
                  className="group flex flex-col p-3 rounded-lg border border-border/30 hover:border-border/80 transition-colors"
                >
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Previous</span>
                  <span className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {prevItem.meta.title}
                  </span>
                </Link>
              )}
              {nextItem && (
                <Link 
                  href={`${getBasePath(nextItem._type)}/${nextItem.meta.slug}`}
                  className="group flex flex-col p-3 rounded-lg border border-border/30 hover:border-border/80 transition-colors"
                >
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Next</span>
                  <span className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {nextItem.meta.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}


        {/* Implicit Connections */}
        {implicitConnections.length > 0 && (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4 text-muted-foreground" /> Conceptually Related
            </h4>
            <div className="flex flex-col gap-3">
              {implicitConnections.map(({ item, shared }) => (
                <Link 
                  key={item.meta.slug} 
                  href={`${getBasePath(item._type)}/${item.meta.slug}`}
                  className="group flex flex-col p-3 rounded-lg border border-border/30 hover:border-border/80 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.meta.title}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    Via: {shared.slice(0, 3).join(', ')}{shared.length > 3 ? '...' : ''}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
