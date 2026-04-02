export const formatCurrency = (amount, compact = false) => {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateShort = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const n = (v) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
};

/** Month-over-month: handles previous month = 0 without faking 0% */
export function getMonthOverMonthDisplay(current, previous) {
  const c = n(current);
  const p = n(previous);
  if (p > 0) {
    const raw = ((c - p) / p) * 100;
    const pct = Number(raw.toFixed(1));
    return {
      mode: 'percent',
      pct,
      headline: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
      direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat',
    };
  }
  if (p === 0 && c > 0) {
    return { mode: 'new', pct: null, headline: 'New', direction: 'new' };
  }
  return { mode: 'none', pct: null, headline: '—', direction: 'flat' };
}

export function formatMoMSubtitle(current, previous) {
  const c = n(current);
  const p = n(previous);
  if (p > 0) return `vs ${formatCurrency(p, true)} last month`;
  if (p === 0 && c > 0) return `Last month: none · this month ${formatCurrency(c, true)}`;
  return 'No activity last month or this month';
}

export function insightMoMLine(label, current, previous) {
  const mom = getMonthOverMonthDisplay(current, previous);
  const cur = n(current);
  const low = label.toLowerCase();
  if (mom.mode === 'percent') {
    return `${label} changed by **${mom.headline}** from last month (${formatCurrency(previous, true)} → ${formatCurrency(current, true)}).`;
  }
  if (mom.mode === 'new') {
    return `${label} this month: **${formatCurrency(current, true)}** — nothing recorded last month.`;
  }
  return `No ${low} to compare; both months are **${formatCurrency(cur, true)}** or empty.`;
}

export function momDeltaLabel(mom) {
  if (mom.mode === 'percent' && mom.pct != null) {
    const a = mom.pct > 0 ? '↑' : mom.pct < 0 ? '↓' : '→';
    return `${a}${Math.abs(mom.pct).toFixed(1)}%`;
  }
  if (mom.mode === 'new') return 'New';
  return '—';
}

export const generateId = () => `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
