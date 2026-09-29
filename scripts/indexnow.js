const fs = require('fs');

const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const HOST = 'sabbir.nav.bd';

async function notifyIndexNow() {
  if (!INDEXNOW_KEY) {
    console.log('ℹ️ INDEXNOW_KEY not set. Skipping IndexNow notification.');
    return;
  }

  // A real implementation would parse the sitemap or use the /api/search response to get changed URLs.
  // For demonstration, we simulate pinging the endpoint for a known URL list.
  const urlList = [
    `https://${HOST}/`
  ];

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log('✅ IndexNow notification successful.');
    } else {
      console.warn(`⚠️ IndexNow notification failed: ${res.status}`);
    }
  } catch (err) {
    console.warn(`⚠️ IndexNow notification error: ${err.message}`);
  }
}

notifyIndexNow();
