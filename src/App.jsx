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
    <div className="min-h-screen bg-neutral-50 dark:bg-black flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar activePage={activePage} onAddTransaction={() => setShowModal(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-auto">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            <PageComponent />
          </div>
        </main>
      </div>
      <MobileNav activePage={activePage} setActivePage={setActivePage} />
      {showModal && state.role === 'admin' && (
        <AddTransactionModal onClose={() => setShowModal(false)} />
      )}
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
