const fs = require('fs');
let file = fs.readFileSync('src/components/content/ConnectedKnowledge.tsx', 'utf8');

const timelineLogic = `
  // 5. Chronological Neighbors (Same Type)
  const sameTypeContent = globalContent
    .filter(c => c._type === currentTypeInferred)
    .sort((a, b) => new Date(a.meta.date).getTime() - new Date(b.meta.date).getTime());
    
  const myIndex = sameTypeContent.findIndex(c => c.meta.slug === meta.slug);
  let nextItem = null;
  let prevItem = null;
  
  if (myIndex > 0) prevItem = sameTypeContent[myIndex - 1];
  if (myIndex !== -1 && myIndex < sameTypeContent.length - 1) nextItem = sameTypeContent[myIndex + 1];
`;

// Insert the timelineLogic after step 4.
// Wait, I don't have currentTypeInferred. I can infer it by checking which array the meta is in, or just pass it down.
// Since `meta` has no `_type`, I can deduce it:
const typeInference = `
  const currentTypeInferred = globalContent.find(c => c.meta.slug === meta.slug)?._type || 'notes';
`;

file = file.replace('// 2. Explicit Relationships', typeInference + '\n\n  // 2. Explicit Relationships');
file = file.replace('const hasAnyConnections =', timelineLogic + '\n\n  const hasAnyConnections =');

// Also update hasAnyConnections to include prevItem/nextItem
file = file.replace(
  'const hasAnyConnections = explicitContent.length > 0 || backlinks.length > 0 || implicitConnections.length > 0;',
  'const hasAnyConnections = explicitContent.length > 0 || backlinks.length > 0 || implicitConnections.length > 0 || prevItem || nextItem;'
);

const timelineJSX = `
        {/* Chronological Navigation */}
        {(prevItem || nextItem) && (
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" /> Timeline
            </h4>
            <div className="flex flex-col gap-3">
              {prevItem && (
                <Link 
                  href={\`\${getBasePath(prevItem._type)}/\${prevItem.meta.slug}\`}
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
                  href={\`\${getBasePath(nextItem._type)}/\${nextItem.meta.slug}\`}
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
`;

file = file.replace('{/* Implicit Connections */}', timelineJSX + '\n\n        {/* Implicit Connections */}');

fs.writeFileSync('src/components/content/ConnectedKnowledge.tsx', file);
