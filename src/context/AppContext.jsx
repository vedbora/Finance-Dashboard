import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { saveToStorage, loadFromStorage } from '../utils/localStorage';
import { generateId } from '../utils/formatters';

const AppContext = createContext(null);

const initialState = {
  transactions: INITIAL_TRANSACTIONS,
  role: 'viewer',
  darkMode: false,
  filters: { type: 'all', search: '', sortBy: 'date', sortDir: 'desc' },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'ADD_TRANSACTION': {
      const next = { ...action.payload, id: generateId() };
      return { ...state, transactions: [next, ...state.transactions] };
    }
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) dispatch({ type: 'LOAD_STATE', payload: saved });
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    saveToStorage({ transactions: state.transactions, role: state.role, darkMode: state.darkMode });
  }, [storageReady, state.transactions, state.role, state.darkMode]);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const filteredTransactions = state.transactions
    .filter(t => {
      if (state.filters.type !== 'all' && t.type !== state.filters.type) return false;
      if (state.filters.search) {
        const q = state.filters.search.toLowerCase();
        return t.description.toLowerCase().includes(q) ||
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      const dir = state.filters.sortDir === 'asc' ? 1 : -1;
      if (state.filters.sortBy === 'date') return dir * (new Date(a.date) - new Date(b.date));
      if (state.filters.sortBy === 'amount') return dir * (a.amount - b.amount);
      return 0;
    });

  return (
    <AppContext.Provider value={{ state, dispatch, filteredTransactions }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
