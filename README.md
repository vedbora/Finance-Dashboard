# FinFlow — Finance Dashboard

A modern, professional fintech dashboard built with React (Vite) and Tailwind CSS. Features real-time filtering, role-based access control, interactive charts, and smart financial insights.

---

## ✨ Features

- **Dashboard Overview** — Summary cards (Balance, Income, Expenses), area line chart for monthly trends, pie chart for spending by category
- **Transactions** — Full table with search, filter by type (Income/Expense), sort by date or amount, mobile-friendly list view
- **Role-Based UI** — Viewer (read-only) / Admin (can add transactions via modal), switchable at runtime
- **Insights Panel** — Top spending category, month-over-month comparison bars, AI-style text insights, savings rate
- **Dark Mode** — Toggle between light and dark themes
- **LocalStorage Persistence** — Transactions and preferences saved across sessions
- **Responsive Design** — Mobile-first with sidebar on desktop, bottom nav on mobile

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + Vite | Frontend framework + build tool |
| Tailwind CSS 3 | Utility-first styling |
| Recharts | Area chart + Pie chart |
| Lucide React | Icon library |
| Context API + useReducer | State management |
| clsx | Conditional classnames |

---

## 🚀 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-repo/finance-dashboard
cd finance-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/        # LineChart, PieChart (Recharts)
│   ├── insights/      # InsightsPanel with smart analysis
│   ├── layout/        # Sidebar, TopBar, MobileNav
│   ├── modals/        # AddTransactionModal
│   ├── transactions/  # TransactionTable with search/filter/sort
│   └── ui/            # Badge, Button, Card, Input, Select
├── context/
│   └── AppContext.jsx  # Global state (transactions, role, filters, dark mode)
├── data/
│   └── mockData.js    # Realistic financial mock data
├── pages/
│   ├── Dashboard.jsx  # Overview page
│   ├── Insights.jsx   # Insights page
│   └── Transactions.jsx
└── utils/
    ├── formatters.js  # Currency, date formatting
    └── localStorage.js # Persistence helpers
```

---

## 🎨 Design Decisions

- **Color system**: Brand blue (#0c87f5), semantic green/red for income/expense
- **Typography**: Sora (clean, modern) + JetBrains Mono (numbers)
- **Cards**: Soft shadows, rounded-2xl, subtle borders
- **Charts**: Area charts with gradient fills for depth

---

## 👥 Roles

| Role | Permissions |
|------|------------|
| **Viewer** | Read-only — view all data, charts, insights |
| **Admin** | All Viewer permissions + Add new transactions |

Switch roles using the dropdown in the top navigation bar.
