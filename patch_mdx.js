const fs = require('fs');
let file = fs.readFileSync('src/components/content/MDXContent.tsx', 'utf8');

const idGenerator = `
const generateId = (children: any) => {
  if (typeof children === 'string') return children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (Array.isArray(children)) return generateId(children.map(c => typeof c === 'string' ? c : '').join(''));
  return '';
};
`;

file = file.replace('const components = {', idGenerator + '\nconst components = {');
file = file.replace(/h2: \(props: any\) => <h2 (.*?) \{\.\.\.props\} \/>/, "h2: (props: any) => { const id = generateId(props.children); return <h2 id={id} $1 {...props} />; }");
file = file.replace(/h3: \(props: any\) => <h3 (.*?) \{\.\.\.props\} \/>/, "h3: (props: any) => { const id = generateId(props.children); return <h3 id={id} $1 {...props} />; }");

fs.writeFileSync('src/components/content/MDXContent.tsx', file);
