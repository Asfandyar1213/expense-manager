import React, { useState } from 'react';
import { format } from 'date-fns';
import { PlusCircle, Check } from 'lucide-react';
import type { Category } from '../types';

interface ExpenseFormProps {
  categories: Category[];
  onAddExpense: (expense: {
    date: string;
    amount: number;
    category: string;
    description: string;
  }) => void;
  onAddCategory: (category: string) => void;
}

export function ExpenseForm({ categories, onAddExpense, onAddCategory }: ExpenseFormProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAddExpense({
      date,
      amount: parseFloat(amount),
      category,
      description,
    });

    setAmount('');
    setDescription('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (PKR)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            placeholder="0.00"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <button
              type="button"
              onClick={() => setShowCategoryInput(!showCategoryInput)}
              className="text-rose-500 hover:text-rose-600 text-sm flex items-center gap-1"
            >
              <PlusCircle size={16} />
              Add New
            </button>
          </div>
          
          {showCategoryInput ? (
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                placeholder="New category name"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
              >
                Add
              </button>
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-all duration-300 ${
            showSuccess
              ? 'bg-green-500'
              : 'bg-gradient-to-r from-orange-500 via-rose-500 to-violet-500 hover:from-orange-600 hover:via-rose-600 hover:to-violet-600'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            {showSuccess ? (
              <>
                <Check size={20} />
                Expense Added!
              </>
            ) : (
              'Submit Expense'
            )}
          </span>
        </button>
      </div>
    </form>
  );
}