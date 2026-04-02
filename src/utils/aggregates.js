import { CATEGORIES, INITIAL_TRANSACTIONS } from '../data/mockData';

const SEED_BALANCE = 847320;

function sumSigned(transactions) {
  return transactions.reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
}

const openingAdjustment = SEED_BALANCE - sumSigned(INITIAL_TRANSACTIONS);

export function getTotalBalance(transactions) {
  return openingAdjustment + sumSigned(transactions);
}

function parseTxnDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const day = Number(m[3]);
    const d = new Date(y, mo, day);
    if (d.getFullYear() === y && d.getMonth() === mo && d.getDate() === day) return d;
  }
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

function inMonth(d, year, monthIndex) {
  return d && d.getFullYear() === year && d.getMonth() === monthIndex;
}

export function getMonthIncomeExpense(transactions, year, monthIndex) {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    const d = parseTxnDate(t.date);
    if (!inMonth(d, year, monthIndex)) continue;
    if (t.type === 'income') income += t.amount;
    else expenses += t.amount;
  }
  return { income, expenses };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function getCurrentMonthSnapshot(transactions, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const cur = getMonthIncomeExpense(transactions, y, m);
  const prev = m === 0
    ? getMonthIncomeExpense(transactions, y - 1, 11)
    : getMonthIncomeExpense(transactions, y, m - 1);
  return {
    income: cur.income,
    expenses: cur.expenses,
    prevMonthIncome: prev.income,
    prevMonthExpenses: prev.expenses,
    totalBalance: getTotalBalance(transactions),
    monthLabel: MONTHS[m],
    year: y,
  };
}

export function getMonthlyTrend(transactions, count = 6, now = new Date()) {
  const out = [];
  let y = now.getFullYear();
  let mo = now.getMonth();
  for (let i = count - 1; i >= 0; i--) {
    const { income, expenses } = getMonthIncomeExpense(transactions, y, mo);
    out.push({ month: MONTHS[mo], income, expenses });
    mo -= 1;
    if (mo < 0) {
      mo = 11;
      y -= 1;
    }
  }
  return out;
}

export function getSpendingByCategory(transactions, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const byCat = {};
  for (const t of transactions) {
    if (t.type !== 'expense') continue;
    const d = parseTxnDate(t.date);
    if (!inMonth(d, y, m)) continue;
    const key = t.category || 'OTHER';
    byCat[key] = (byCat[key] || 0) + t.amount;
  }
  return Object.entries(byCat)
    .map(([category, value]) => {
      const meta = CATEGORIES[category] || { label: category, color: '#64748b' };
      return { name: meta.label, value, color: meta.color, category };
    })
    .sort((a, b) => b.value - a.value);
}
