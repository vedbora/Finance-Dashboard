import TransactionTable from '../components/transactions/TransactionTable';

export default function Transactions() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white tracking-tight">All transactions</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Search, sort, and filter your activity</p>
      </div>
      <TransactionTable />
    </div>
  );
}
