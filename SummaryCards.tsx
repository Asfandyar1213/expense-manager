import React from 'react';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';
import type { Expense, Category, Budget } from '../types';

interface SummaryCardsProps {
  expenses: Expense[];
  categories: Category[];
  budget: Budget;
}

export function SummaryCards({ expenses, categories, budget }: SummaryCardsProps) {
  const totalMonthly = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageDaily = totalMonthly / 30;
  const remaining = budget.amount - totalMonthly;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const highestCategory = Object.entries(categoryTotals).reduce(
    (max, [category, amount]) => (amount > max.amount ? { category, amount } : max),
    { category: '', amount: 0 }
  );

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-white/80 text-sm">Budget Remaining</p>
            <p className="text-2xl font-bold">PKR {remaining.toFixed(2)}</p>
            <p className="text-sm opacity-80">
              {((remaining / budget.amount) * 100).toFixed(1)}% left
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-rose-500 to-violet-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-white/80 text-sm">Average Daily</p>
            <p className="text-2xl font-bold">PKR {averageDaily.toFixed(2)}</p>
            <p className="text-sm opacity-80">
              {((totalMonthly / budget.amount) * 100).toFixed(1)}% of budget
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <PieChart size={24} />
          </div>
          <div>
            <p className="text-white/80 text-sm">Highest Category</p>
            <p className="text-2xl font-bold">{getCategoryName(highestCategory.category)}</p>
            <p className="text-sm opacity-80">PKR {highestCategory.amount.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}