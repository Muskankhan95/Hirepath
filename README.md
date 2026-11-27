- Developed & Maintained By: <Priya> and <Muskan Khan> <CSE 22> 
- Full Stack Development Team
- © 2026 ABESEC Ghaziabad. All Rights Reserved.


<<<<<<< HEAD
# 🚀 HirePath SaaS Platform
> *"Your Career. Your Opportunities. Your Future."*

**HirePath** is an enterprise-grade, AI-powered Student Internship & Placement Management SaaS platform connecting **Students**, **Corporate Recruiters**, and **Training & Placement Officers (TPOs)**.

---

## 🌟 Key Features by Persona

### 🎓 1. Student Portal (`/student`)
- **Smart Opportunity Feed:** Search, filter by branch, CTC slider, and work mode. Real-time eligibility calculator with CGPA checks and TPO verification status.
- **1-Click Application:** Instant submission with verified institutional placement pass.
- **Visual Application Tracker:** Multi-stage Kanban-style pipeline tracking (`Applied` → `Under Review` → `Shortlisted` → `Assessment` → `Technical Round` → `HR Round` → `Offer Extended`).
- **Interactive Interview Hub:** Integrated Google Meet links, interview date/time notices, and recruiter feedback notes.
- **Offer Celebration:** Animated offer celebration with canvas confetti and downloadable offer letter documents.
- **Gemini AI Resume Matcher:** ATS keyword scan against any target job drive, match percentage meter, skill gaps detection, missing keywords copy-helper, and role suggestions.
- **Digital Placement Pass (`qrcode.react`):** Anti-tamper QR badge with student academic transcripts for on-campus written tests and interview gates.

### 💼 2. Recruiter Portal (`/recruiter`)
- **Talent Overview Dashboard:** Active drives counter, total applicant pool, shortlisted candidates, and offer conversions.
- **Campus Drive Authoring:** Multi-step drive creator (`postDriveSchema` + Zod) with dynamic multi-round builder, CTC packages, openings, and strict eligibility thresholds.
- **Recruitment Kanban Pipeline:** Drag/advance applicants across 6 recruitment stages with live candidate scorecards.
- **Candidate Evaluation Modal:** Detailed candidate marks, AI match score, interview scheduler (creates Google Meet links), and official offer letter dispatcher.

### 🏛️ 3. TPO Officer Portal (`/tpo`)
- **Placement Command Center:** Real-time metrics on placement rate, highest/average packages, total offers, and NIRF-ready data.
- **Interactive Recharts Visualizations:** Cumulative placement velocity trend, branch-wise registered vs. placed bar charts, and CTC package distribution histograms.
- **Compliance & Approval Queue:** 3-tab verification desk for incoming company drives, recruiter registrations, and student academic profiles.
- **Official Placement Reports:** Searchable cohort register with instant CSV export for accreditation committees.

---

## 🛠️ Tech Stack & Architecture

- **Core:** React 18+, TypeScript (strict mode), Vite 5
- **Styling:** Tailwind CSS with custom navy (`#0b1120`, `#0e1526`), indigo (`#6366f1`), and violet (`#8b5cf6`) palette, full dark mode support
- **Animations:** Framer Motion (page transitions, spring modals, micro-interactions)
- **Icons:** Lucide React
- **Analytics & Charts:** Recharts (Responsive area, bar, and pie charts)
- **Forms & Validation:** React Hook Form + Zod (`@hookform/resolvers`)
- **Toasts:** Sonner (`richColors`, `closeButton`)
- **Verification Badges:** `qrcode.react` (high-res SVG QR codes)
- **AI Service:** `@google/genai` (structured prompt runner with intelligent fallback engine)
- **Data Layer:** Supabase-ready client with automated `LocalStorage` state store

---

## ⚡ Quick Demo Logins

The application features a **1-Click Instant Persona Switcher** in both the Login page and top Navbar:

| Persona | Name | Email | Password | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Student** | Alex Chen | `alex.chen@campus.edu` | `password123` | `student` |
| **Recruiter** | Sarah Jenkins | `sarah.jenkins@google.com` | `password123` | `recruiter` |
| **TPO Officer** | Dr. Arthur Vance | `tpo.director@university.edu` | `password123` | `tpo` |

---
## Render URL = https://hirepath-1-xr8o.onrender.com
## 🚀 Getting Start 

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```
=======
# Hirepath
HirePath is an AI-powered internship and placement management platform that connects students, recruiters, and placement officers. It simplifies opportunity discovery, eligibility checking, resume analysis, job recommendations, and application tracking.
>>>>>>> origin/main
