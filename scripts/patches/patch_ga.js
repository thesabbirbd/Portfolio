const fs = require('fs');
let file = fs.readFileSync('src/app/layout.tsx', 'utf8');

const gaScript = `
        {/* Google Analytics Tag */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-47T386XBN6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-47T386XBN6');
          \`}
        </Script>
`;

// Insert after <head>
file = file.replace(/<head>/, '<head>' + gaScript);

fs.writeFileSync('src/app/layout.tsx', file);
