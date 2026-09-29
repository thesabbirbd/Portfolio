const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirs = ['projects', 'notes', 'journal', 'lab'];
const contentPath = path.join(__dirname, '..', 'content');

let errors = 0;
let warnings = 0;
const slugs = new Set();
const relationships = new Set(); // To cross-check later

console.log('🔍 Starting Content Validation...\n');

contentDirs.forEach(dir => {
  const dirPath = path.join(contentPath, dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.mdx'));
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    // 1. Check required metadata
    const required = ['title', 'slug', 'date', 'type', 'author', 'brand'];
    required.forEach(field => {
      if (!data[field]) {
        console.error(`❌ [ERROR] Missing '${field}' in ${dir}/${file}`);
        errors++;
      }
    });

    // 2. Slug validation
    if (data.slug) {
      if (slugs.has(data.slug)) {
        console.error(`❌ [ERROR] Duplicate slug '${data.slug}' found in ${dir}/${file}`);
        errors++;
      } else {
        slugs.add(data.slug);
      }
    }

    // 3. Identity reinforcement
    if (data.author && data.author !== 'Md Sabbirul Islam Khan') {
      console.warn(`⚠️ [WARN] Non-standard author '${data.author}' in ${dir}/${file}`);
      warnings++;
    }
    if (data.brand && data.brand !== 'THE SABBiR') {
      console.warn(`⚠️ [WARN] Non-standard brand '${data.brand}' in ${dir}/${file}`);
      warnings++;
    }

    // 4. Collect relationships
    ['relatedProjects', 'relatedNotes', 'relatedJournal', 'relatedLab'].forEach(relField => {
      if (data[relField] && Array.isArray(data[relField])) {
        data[relField].forEach(relSlug => relationships.add({ source: data.slug, target: relSlug, field: relField }));
      }
    });
  });
});

console.log('\n📊 Content Summary:');
console.log(`- Total Files Checked: ${slugs.size}`);
console.log(`- Errors: ${errors}`);
console.log(`- Warnings: ${warnings}`);

if (errors > 0) {
  console.error('\n❌ Content validation failed. Please fix the errors above.');
  process.exit(1);
} else {
  console.log('\n✅ Content validation passed.');
}
