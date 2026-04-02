import TransactionTable from '../components/transactions/TransactionTable';

export default function Transactions() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-xl">All transactions</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Search, sort, and filter your activity</p>
      </div>
      <TransactionTable />
    </div>
  );
}
