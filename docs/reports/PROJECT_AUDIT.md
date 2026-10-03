# 🛰️ PROJECT AUDIT & SYSTEM DISCOVERY (PHASE 0)
**Project:** Md Sabbirul Islam Khan (SABBiR) — Personal Digital Identity Platform  
**Target Domain:** `sabbir.nav.bd` | **Deployment Platform:** Vercel  
**Audit Date:** September 16, 2026  
**Auditor:** Antigravity Engineering Agent  

---

## 1. Executive Summary & Verification
This audit assesses the local machine environment, existing repositories, digital assets, and system configuration before initiating UI architecture. All verified facts have been extracted directly from the existing system and verified profile repositories (`thesabbirbd/thesabbirbd` and `Omnidesk-BD`). **Zero facts have been fabricated.**

---

## 2. Detected Tooling & Runtime Environment

| Component | Status / Version | Details |
| :--- | :--- | :--- |
| **OS** | Linux (Ubuntu/Debian Kernel) | x86_64, High-performance environment |
| **Node.js** | `v24.20.0` | Modern LTS/Current runtime |
| **npm** | `11.19.0` | Ready for dependency orchestration |
| **Git** | `2.43.0` | Initialized & configured globally |
| **Git Global Identity** | `Md Sabbirul Islam Khan` | `<99889716+thesabbirbd@users.noreply.github.com>` |
| **GitHub Authentication** | **Active (SSH)** | `ssh -T git@github.com` authenticated as `thesabbirbd` |
| **GitHub CLI (`gh`)** | Not installed | Git operations will run seamlessly via direct SSH remotes |
| **Existing Next.js Site**| None in scratch | Clean slate; no legacy technical debt |

---

## 3. Existing Local Repositories & Discovered Assets

### A. Core Profile Source: `/home/thesabbir/thesabbirbd`
* **Type:** Special GitHub Profile Repository (`thesabbirbd/thesabbirbd`)
* **Remote:** `git@github.com:thesabbirbd/thesabbirbd.git`
* **Verified Biographical Facts:**
  * **Full Name:** Md Sabbirul Islam Khan
  * **Brand Short Name:** **SABBiR**
  * **Intersection:** Business Management × Backend Engineering × DevOps × AI × Systems × Networking × Hardware × Multimedia
  * **Academic:** BBA in Management, Rajshahi College (National University); Technical foundation: Hat Gangopara BM Technical College
  * **Location:** Living in Rajshahi, from Bagmara, Rājshāhi, Bangladesh
  * **Hands-on Experience & Volunteering:**
    * NOC Support & MTCNA Intern at Shunno IT (শূন্য আইটি)
    * Python Specialized Trainee at Bangladesh Hi-Tech Park Authority (BHTPA)
    * Cloud Engineering V1 Certification (Muktopaath)
    * Google Local Guide & 360° Street View Photographer (Direct Google HQ recognition & gifts recipient)
    * Media Production Specialist at Aditi (অদিতি)
    * IT Executive at Rajshahi College Presentation Club (RCPC)
    * Member at Rajshahi College Business Club (RCBC)
    * General Member at Volunteer for Bangladesh (VBD)
    * Volunteer & Donor at Blood Fighters Finder Rajshahi (BFFR)
  * **Contact & Socials:**
    * Email: `iamthesabbir@gmail.com`
    * GitHub: `thesabbirbd`
    * LinkedIn: `thesabbirbd`
    * Facebook: `iamthesabbir`
    * Instagram: `iam_thesabbir`
    * X (Twitter): `thesabbirbd`

### B. Flagship Project Source: `/home/thesabbir/Documents/Project Backend - DevOps/Omnidesk-BD`
* **Type:** Production-grade Multi-domain Study & Engineering Workspace
* **Remote:** `git@github.com:thesabbirbd/Omnidesk-BD.git`
* **Architecture:** Local-first, FastAPI, PostgreSQL, Docker, Nginx, Ollama (Offline LLM), Tauri frontend
* **Discovered High-Resolution Media & Diagrams:**
  * `docs/images/omnidesk-glass-dashboard.png` (Glassmorphism desktop UI)
  * `docs/images/omnidesk-dag-mindmap.png` (DAG Mindmap system node visualization)
  * `docs/images/omnidesk-materials-engine.png` (Materials engine interface)
  * `docs/images/omnidesk-focus-timer-presence.png` (Focus timer telemetry)
  * `docs/images/omnidesk-clay-dashboard.png` (Clay/Glass variation)
  * `docs/images/omnidesk-debug-lab-modal.png` (Debug lab modal)
  * `frontend/public/omnidesk-logo.png` & `omnidesk-mark.png`

### C. Personal Photography:
* `/home/thesabbir/Downloads/SABBiR Formal PP 2025.png` (Authentic formal profile portrait)

---

## 4. Proposed Technology Stack

* **Framework:** Next.js 14/15 (App Router, React 18/19, TypeScript)
* **Styling & Design Tokens:** Tailwind CSS, CSS Custom Properties for Glassmorphism & iOS Spatial depth tokens
* **Motion & Spring Physics:** `motion` (or `framer-motion`)
* **3D Visual Core:** `three`, `@react-three/fiber`, `@react-three/drei` (Hero glass sphere & interactive tech nodes)
* **Theme Management:** `next-themes` (Light, Dark, System auto-detection with zero flicker)
* **Iconography:** `lucide-react` (Apple/iOS refined line geometry)
* **Deployment Target:** Vercel (CI/CD via GitHub `thesabbirbd/sabbir-portfolio`)
* **Target Subdomain:** `sabbir.nav.bd` (CNAME routing to Vercel edge)

---

## 5. Potential Risks & Mitigation Strategies

1. **3D Performance & Mobile Battery Drain:**
   * *Risk:* Heavy Three.js render loops can throttle mobile CPU/GPU and impact Core Web Vitals (LCP/INP).
   * *Mitigation:* Lazy-load 3D canvas via dynamic imports (`ssr: false`); pause canvas rendering when off-screen; provide a lightweight CSS glass-layered fallback on mobile screens (`< 768px`) and for users with `prefers-reduced-motion`.
2. **Strict Adherence to "Content Truth Rule":**
   * *Risk:* Accidental generation of placeholder claims or inflated corporate experience.
   * *Mitigation:* Hardcoded data structures in `src/data/*` grounded strictly in verified sources (`thesabbirbd/README.md` and `Omnidesk-BD`).
3. **Typography & Styling Clutter:**
   * *Risk:* Deviating into generic cyberpunk black-and-neon tropes.
   * *Mitigation:* Strict adherence to iOS/visionOS Spatial UI guidelines: soft graphite, frosted translucent glass, subtle electric blue/cyan accents, and daylight glass light mode.

---

## 6. Implementation Strategy & Next Steps

Following the Master Engineering Specification, execution proceeds strictly phase by phase:

* [x] **Phase 0: Discovery & Audit (`PROJECT_AUDIT.md`)** — *COMPLETE*
* [ ] **Phase 1: Design System & Design Tokens** (Tailwind config, CSS variables, glassmorphism tokens, base UI components)
* [ ] **Phase 2: Global Site Framework & App Foundation** (Root layout, theme provider, floating glass capsule navbar, responsive container)
* [ ] **Phase 3: Hero Experience & 3D Spatial Core**
* [ ] **Phase 4: About & Engineering Journey**
* [ ] **Phase 5: Tech Arsenal & Capability Nodes**
* [ ] **Phase 6: Omnidesk BD Flagship Showcase (3D System Node Map)**
* [ ] **Phase 7: Projects & Systems Lab**
* [ ] **Phase 8: Current 100-Day Mission & GitHub Telemetry**
* [ ] **Phase 9: Creative & Hardware Dimension**
* [ ] **Phase 10: Contact Experience & Precision Footer**
* [ ] **Phase 11: Easter Eggs & Interactive Polish**
* [ ] **Phase 12: QA, Production Build (`npm run build`), & Performance Audit**
* [ ] **Phase 13: Git Push & Vercel Deployment Guide (`DEPLOYMENT.md`)**

---
*Generated by Antigravity Engineering Agent for Md Sabbirul Islam Khan (SABBiR)*
