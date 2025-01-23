import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import type { Budget } from '../types';

interface BudgetManagerProps {
  budget: Budget;
  onUpdateBudget: (amount: number) => void;
  totalSpent: number;
}

export function BudgetManager({ budget, onUpdateBudget, totalSpent }: BudgetManagerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(budget.amount.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (!isNaN(amount) && amount >= 0) {
      onUpdateBudget(amount);
      setIsEditing(false);
    }
  };

  const remaining = budget.amount - totalSpent;
  const percentageSpent = budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Wallet className="text-rose-500" size={20} />
          Monthly Budget
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm text-rose-500 hover:text-rose-600"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget Amount (PKR)</label>
            <input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              min="0"
              step="100"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
          >
            Save Budget
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Budget:</span>
            <span className="font-semibold">PKR {budget.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Spent:</span>
            <span className="font-semibold">PKR {totalSpent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Remaining:</span>
            <span className={`font-semibold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
              PKR {remaining.toFixed(2)}
            </span>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  percentageSpent > 100
                    ? 'bg-red-500'
                    : percentageSpent > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentageSpent, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              {percentageSpent.toFixed(1)}% of budget used
            </p>
          </div>
        </div>
      )}
    </div>
  );
}