import React, { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseTable } from './components/ExpenseTable';
import { ExpenseCharts } from './components/ExpenseCharts';
import { SummaryCards } from './components/SummaryCards';
import { BudgetManager } from './components/BudgetManager';
import type { Expense, Category, Budget } from './types';
import { format } from 'date-fns';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'groceries', name: 'Groceries', color: '#FF6B6B' },
  { id: 'utilities', name: 'Utilities', color: '#4ECDC4' },
  { id: 'rent', name: 'Rent', color: '#45B7D1' },
  { id: 'entertainment', name: 'Entertainment', color: '#96CEB4' },
  { id: 'transport', name: 'Transport', color: '#FFBE0B' },
];

function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [budget, setBudget] = useState<Budget>(() => {
    const saved = localStorage.getItem('budget');
    const currentMonth = format(new Date(), 'yyyy-MM');
    return saved ? JSON.parse(saved) : { amount: 0, month: currentMonth };
  });

  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [budget]);

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter(expense => expense.id !== id));
  };

  const handleAddCategory = (name: string) => {
    const newCategory: Category = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleUpdateBudget = (amount: number) => {
    setBudget({
      amount,
      month: format(new Date(), 'yyyy-MM')
    });
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (viewMode === 'daily') {
      return new Date(expense.date).toDateString() === new Date().toDateString();
    }
    const currentMonth = new Date().getMonth();
    const expenseMonth = new Date(expense.date).getMonth();
    return currentMonth === expenseMonth;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-violet-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-rose-500 to-violet-500 bg-clip-text text-transparent">
            Saman Manager
          </h1>
          <p className="text-gray-600 mt-2">Track Your Daily Expenses</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <ExpenseForm
              categories={categories}
              onAddExpense={handleAddExpense}
              onAddCategory={handleAddCategory}
            />
            <div className="mt-6">
              <BudgetManager
                budget={budget}
                onUpdateBudget={handleUpdateBudget}
                totalSpent={filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <SummaryCards 
              expenses={filteredExpenses} 
              categories={categories}
              budget={budget}
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'daily'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-rose-500'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-4 py-2 rounded-lg ${
                  viewMode === 'monthly'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-rose-500'
                }`}
              >
                Monthly
              </button>
            </div>
            <button
              onClick={() => {
                const csvContent = `data:text/csv;charset=utf-8,${
                  ['Date,Amount (PKR),Category,Description']
                    .concat(
                      expenses.map(e =>
                        `${e.date},${e.amount},${categories.find(c => c.id === e.category)?.name},${e.description}`
                      )
                    )
                    .join('\n')
                }`;
                const link = document.createElement('a');
                link.href = encodeURI(csvContent);
                link.download = 'saman-expenses.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-4 py-2 bg-white text-rose-500 rounded-lg hover:bg-rose-50"
            >
              Export CSV
            </button>
          </div>
          <ExpenseTable 
            expenses={filteredExpenses} 
            categories={categories} 
            onDelete={handleDeleteExpense}
          />
        </div>

        <ExpenseCharts 
          expenses={filteredExpenses} 
          categories={categories}
          budget={budget}
        />
      </div>
    </div>
  );
}

export default App;