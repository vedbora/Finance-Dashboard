import { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const categoryOptions = Object.entries(CATEGORIES).map(([value, { label }]) => ({ value, label }));

export default function AddTransactionModal({ onClose }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState({
    description: '', merchant: '', amount: '', category: 'SALARY', type: 'income', date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { ...form, amount: Number(form.amount), merchant: form.merchant || form.description },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200" onClick={onClose} aria-hidden />
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-2xl shadow-black/20 w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200/80 dark:border-white/10">
          <div>
            <h2 className="font-semibold text-neutral-900 dark:text-white text-lg tracking-tight">Add transaction</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">Record income or expense</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200 active:scale-95"
          >
            <X size={16} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 block mb-2">Transaction type</label>
            <div className="flex rounded-xl border border-neutral-200 dark:border-white/10 p-1 gap-1 bg-neutral-50 dark:bg-neutral-950">
              {['income', 'expense'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t, category: t === 'income' ? 'SALARY' : 'RENT' }))}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                    form.type === t
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                  }`}
                >
                  {t === 'income' ? '↑' : '↓'} {t}
                </button>
              ))}
            </div>
          </div>

          <Input label="Description" placeholder="e.g. Monthly salary, Subscription" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} error={errors.description} />
          <Input label="Merchant / Source" placeholder="e.g. Employer, Vendor" value={form.merchant} onChange={(e) => setForm((f) => ({ ...f, merchant: e.target.value }))} />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₹)" type="number" placeholder="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} error={errors.amount} />
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} error={errors.date} />
          </div>

          <Select
            label="Category"
            options={categoryOptions.filter((opt) => {
              const incomeCategories = ['SALARY', 'FREELANCE', 'INVESTMENT'];
              return form.type === 'income' ? incomeCategories.includes(opt.value) : !incomeCategories.includes(opt.value);
            })}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSubmit}>Add transaction</Button>
        </div>
      </div>
    </div>
  );
}
