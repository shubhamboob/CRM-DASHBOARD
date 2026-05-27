# 🏗️ Raghav Realty — CRM Command Center Dashboard

A production-grade CRM analytics dashboard for Raghav Realty's CRM department, built with React + Vite, deployed on Vercel, with an AI assistant powered by Google Gemini.

---

## 🚀 Quick Deploy to Vercel via GitHub

### Step 1 — Push to GitHub
```bash
# Create a new repo on github.com named: raghav-crm-dashboard
# Then:
git init
git add .
git commit -m "feat: initial CRM dashboard"
git remote add origin https://github.com/YOUR_USERNAME/raghav-crm-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your `raghav-crm-dashboard` GitHub repository
3. Framework will auto-detect as **Vite**
4. Click **Deploy** — done in ~60 seconds ✅

---

## 📊 Dashboard Features

### 4 Core Tabs
| Tab | What it shows |
|-----|--------------|
| **Overview** | KPI cards, CRM achievement gauge, collection by project, outstanding & pending registrations |
| **Projects** | Full data matrix table, collection efficiency per project |
| **Target vs Achievement** | Project-wise & category-wise bar charts with forecast |
| **Trends** | 3-month area/line charts for target, collection, bookings, pending reg |

### AI Chat (Gemini)
- Click the 💬 button (bottom-right)
- Enter your **free Gemini API key** from [ai.google.dev](https://ai.google.dev)
- Ask questions like:
  - "Which project has the highest outstanding?"
  - "What's our registration risk this month?"
  - "Compare March vs May performance"
  - "Give me a summary of Avenue project"

---

## 📁 Adding New Monthly Data

Each month, a new Excel file with `Overall_Draft` sheet is added. To update the dashboard:

### Option A — Manual (current setup)
1. Open `src/data/crmData.js`
2. Add a new entry in the `monthsData` object following the exact same structure
3. Extract values from `Overall_Draft` sheet rows:
   - **Row 3–9, Col 11–21** → Project-level collection data
   - **Row 10, Col 12–21** → Total row
   - **Row 19–26, Col 13–16** → Project Target vs Achievement
   - **Row 19–24, Col 23–26** → Category Target vs Achievement
4. Push to GitHub → Vercel auto-deploys

### Option B — Automated (future enhancement)
Run the extraction script:
```bash
python3 scripts/extract_month.py path/to/Overall_Collection_Summary_June_26.xlsx
```
This will auto-generate the JS snippet to paste into `crmData.js`.

---

## 🗂️ Project Structure

```
crm-dashboard/
├── src/
│   ├── App.jsx          # Main dashboard component (all 4 tabs + AI chat)
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global CSS design tokens
│   └── data/
│       └── crmData.js   # ← ADD NEW MONTHS HERE
├── public/
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 🧩 Data Schema Reference

Each month entry in `crmData.js` follows this structure:

```js
"Month YYYY": {
  date: "YYYY-MM-DD",           // Report date
  crm_target: Number,            // Monthly CRM target (₹ Cr)
  crm_achievement: Number,       // Actual achievement (₹ Cr)
  crm_pct: Number,               // Achievement % (0-100)
  projects: [                    // 7 projects
    {
      name: String,
      live_bookings: Number,
      daily_collection: Number,   // ₹ Cr
      monthly_collection: Number, // ₹ Cr
      monthly_registrations: Number,
      demand_raised: Number,      // Cumulative ₹ Cr
      collection_till_date: Number,
      outstanding: Number,
      pending_reg: Number,
      pending_reg_45d: Number,    // Pending > 45 days
      reg_targets: Number,
    }
  ],
  total: { /* same fields */ },
  project_tva: [                 // Target vs Achievement per project
    { name, target, achievement, achievement_pct, forecast }
  ],
  category_tva: [               // Category-wise breakdown
    { category, target, achievement, achievement_pct }
  ],
  weekly_forecast: [            // Weekly collection
    { week, target, achievement }
  ]
}
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Google Gemini 2.0 Flash (free tier) |
| Fonts | Syne (display) + DM Sans (body) |
| Hosting | Vercel (free tier) |
| Source | GitHub |

---

## 📌 Color Coding Logic

| Metric | Color |
|--------|-------|
| ≥ 80% achievement | 🟢 Green |
| 50–79% achievement | 🟡 Amber |
| < 50% achievement | 🔴 Red |
| Pending reg > 45d | 🔴 Red alert |
| Outstanding | 🟡 Amber |
| Target | 🔵 Blue |

---

*Built for Raghav Realty CRM Department — Mumbai*
