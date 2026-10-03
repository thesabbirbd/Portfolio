const fs = require('fs');
const file = 'src/app/layout.tsx';
let content = fs.readFileSync(file, 'utf8');

const jsonLd = `
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Md Sabbirul Islam Khan",
  "alternateName": "THE SABBiR",
  "url": "https://sabbir.nav.bd/",
  "image": "https://sabbir.nav.bd/the-sabbir-og-1200x630.jpg",
  "description": "Md Sabbirul Islam Khan, known online as THE SABBiR, is a Management student from Rajshahi, Bangladesh exploring Backend Engineering, DevOps, AI, Linux, Networking, IT Systems and Creative Technology.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Rajshahi",
    "addressCountry": "Bangladesh"
  },
  "sameAs": [
    "https://github.com/thesabbirbd",
    "https://bd.linkedin.com/in/thesabbirbd"
  ],
  "knowsAbout": [
    "Backend Engineering",
    "DevOps",
    "Local AI",
    "Linux",
    "Networking",
    "IT Systems"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "THE SABBiR",
  "alternateName": "Md Sabbirul Islam Khan",
  "url": "https://sabbir.nav.bd/"
};
`;

if (!content.includes('personSchema')) {
  content = content.replace('export default function RootLayout({', jsonLd + '\nexport default function RootLayout({');
  
  const scriptTag = `
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ThemeProvider`;
        
  content = content.replace('<ThemeProvider', scriptTag);
  fs.writeFileSync(file, content);
  console.log("Patched layout.tsx with JSON-LD");
} else {
  console.log("Already patched");
}
