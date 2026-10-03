# 🚀 DEPLOYMENT & DOMAIN ROUTING GUIDE
**Project:** Md Sabbirul Islam Khan (SABBiR) — Personal Digital Identity Platform  
**Target Domain:** `sabbir.nav.bd`  
**Hosting Provider:** Vercel (Edge Network / CI/CD)  
**Repository Source:** GitHub (`thesabbirbd`)

---

## 1. Local Git & GitHub Push

The local repository is fully built, tested, and tracked on branch `main` at:
`/home/thesabbir/Documents/Portfolio Website SABBiR`

### Step A: Create a New Repository on GitHub
1. Open your browser and go to: [github.com/new](https://github.com/new)
2. Repository Name: `sabbir-portfolio` (or your preferred name)
3. Set Visibility: **Public**
4. Do **NOT** initialize with a README, .gitignore, or license (we already have clean ones locally).
5. Click **Create repository**.

### Step B: Push Local Commits via SSH
Open your terminal inside `/home/thesabbir/Documents/Portfolio Website SABBiR` (or run these commands):

```bash
cd "/home/thesabbir/Documents/Portfolio Website SABBiR"

# Add your GitHub remote (SSH is already verified on your machine!)
git remote add origin git@github.com:thesabbirbd/sabbir-portfolio.git

# Push the complete commit history to main
git push -u origin main
```

---

## 2. Connect & Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account (**thesabbirbd**).
2. From the Vercel Dashboard, click **Add New...** → **Project**.
3. Locate **sabbir-portfolio** from your GitHub repositories and click **Import**.
4. Configure Project:
   * **Framework Preset:** `Next.js` (automatically detected)
   * **Root Directory:** `./`
   * **Build Command:** `npm run build` (default)
   * **Output Directory:** `.next` (default)
5. Click **Deploy**.
6. In approximately 45–60 seconds, your site will be live on a free `*.vercel.app` URL.

---

## 3. Configure Custom Subdomain: `sabbir.nav.bd`

### Step A: Add Domain in Vercel
1. In your Vercel Project Dashboard, go to **Settings** → **Domains**.
2. Type `sabbir.nav.bd` and click **Add**.
3. Vercel will prompt you with the required DNS record:
   * **Type:** `CNAME`
   * **Name / Host:** `sabbir`
   * **Value:** `cname.vercel-dns.com`

### Step B: Add DNS Record in your Domain DNS Manager
Go to the DNS Zone Editor for `nav.bd` (cPanel / Cloudflare / Domain Management Portal):

| Record Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `sabbir` *(or `sabbir.nav.bd`)* | `cname.vercel-dns.com.` | `3600` (or Auto) |

### Step C: Verification & Automatic SSL
* Once added, Vercel will detect the CNAME record within 5–15 minutes.
* Vercel will automatically issue a free **Let's Encrypt SSL/TLS certificate** (HTTPS).
* Your portfolio will now load securely at:  
  **`https://sabbir.nav.bd`**

---

## 4. Continuous Deployment (CI/CD)

Whenever you push any new update, commit, or project to the `main` branch on GitHub:
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```
Vercel will automatically build and deploy your changes to `sabbir.nav.bd` within 1 minute with zero downtime!

---
*Crafted with precision for Md Sabbirul Islam Khan (SABBiR)*
