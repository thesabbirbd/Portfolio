const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirs = ['projects', 'notes', 'journal', 'lab'];
const contentPath = path.join(__dirname, '..', 'content');

console.log('📈 Content Intelligence Dashboard\n');

let totalContent = 0;
const orphans = [];
const stale = [];

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const now = new Date();

contentDirs.forEach(dir => {
  const dirPath = path.join(contentPath, dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx'));
  
  files.forEach(file => {
    totalContent++;
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    // Check Connections (Orphan detection)
    const hasRelations = ['relatedProjects', 'relatedNotes', 'relatedJournal', 'relatedLab']
      .some(field => data[field] && data[field].length > 0);

    if (!hasRelations) {
      orphans.push(`${dir}/${file} (${data.title})`);
    }

    // Check Stale Content
    if (data.date) {
      const pubDate = new Date(data.date);
      if (now - pubDate > ONE_YEAR_MS) {
        stale.push(`${dir}/${file} (${data.date})`);
      }
    }
  });
});

console.log('=== SUMMARY ===');
console.log(`Total Published Items: ${totalContent}\n`);

console.log('=== CONTENT OPPORTUNITIES (No Relations) ===');
if (orphans.length === 0) {
  console.log('✅ All content is connected into the Knowledge Graph.');
} else {
  orphans.forEach(o => console.log(`- ${o}`));
  console.log('💡 Tip: Consider linking these to existing projects or notes to improve discovery.');
}

console.log('\n=== STALE CONTENT REVIEW (> 1 Year Old) ===');
if (stale.length === 0) {
  console.log('✅ No stale content detected.');
} else {
  stale.forEach(s => console.log(`- ${s}`));
  console.log('💡 Tip: Review these to ensure architectural assumptions remain valid.');
}
