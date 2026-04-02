import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MobileNav from './components/layout/MobileNav';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import AddTransactionModal from './components/modals/AddTransactionModal';
import { useApp } from './context/AppContext';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const { state } = useApp();

  const pages = { dashboard: Dashboard, transactions: Transactions, insights: Insights };
  const PageComponent = pages[activePage];

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-black">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar activePage={activePage} onAddTransaction={() => setShowModal(true)} />
        <main className="flex-1 overflow-auto px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-8 lg:pb-8">
          <div className="mx-auto w-full max-w-7xl space-y-8">
            <PageComponent />
          </div>
        </main>
      </div>
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
      {showModal && state.role === 'admin' && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
