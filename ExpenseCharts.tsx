import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Expense, Category, Budget } from '../types';

interface ExpenseChartsProps {
  expenses: Expense[];
  categories: Category[];
  budget: Budget;
}

export function ExpenseCharts({ expenses, categories, budget }: ExpenseChartsProps) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = categories.find(cat => cat.id === expense.category);
    if (!category) return acc;
    
    acc[category.name] = (acc[category.name] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]) // Sort by amount in descending order
    .map(([name, value]) => ({
      name,
      value,
      color: categories.find(cat => cat.name === name)?.color || '#000000',
    }));

  // Group expenses by week
  const weeklyData = expenses.reduce((acc, expense) => {
    const week = new Date(expense.date).toISOString().slice(0, 10);
    acc[week] = (acc[week] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(weeklyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, amount]) => ({
      date: date.slice(5),
      amount,
      budget: budget.amount / 4, // Weekly budget (monthly/4)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: PKR {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Top Spending Categories</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Weekly Spending vs Budget</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="amount" name="Spent" fill="#FF6B6B" />
              <Bar dataKey="budget" name="Weekly Budget" fill="#4ECDC4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}