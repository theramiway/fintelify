import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import BudgetWidget from "@/components/BudgetWidget";
import SavingsGoal from "@/components/SavingsGoal";
import AnalyticsWidget from "@/components/AnalyticsWidget";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowUp, ArrowDown, Trash2 } from "lucide-react";

// Interface for your Transaction data
interface Transaction {
  _id: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category?: string;
  date: string;
}

const Transactions = () => {
  const API_URL = "http://localhost:5000/api/transactions";
  
  // --- 1. DUMMY INITIAL BALANCE ---
  // Change this number to whatever starting balance you want
  const STARTING_BALANCE = 50000; 

  // --- STATE ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "Expense",
    category: "General"
  });

  // --- API CALLS ---
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount)
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchTransactions(); 
        setIsModalOpen(false); 
        setFormData({ description: "", amount: "", type: "Expense", category: "General" }); 
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // --- 2. UPDATED CALCULATIONS ---
  // Sum of all transactions (Expenses are negative, Income is positive)
  const transactionsSum = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Final Balance = Starting Amount + (Sum of Transactions)
  const totalBalance = STARTING_BALANCE + transactionsSum;

  const formattedBalance = Math.abs(totalBalance).toLocaleString('en-IN');
  const isNegative = totalBalance < 0;

  return (
    <DashboardLayout>
      <div className="p-8 relative">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between mb-8">
          
          {/* Balance Widget */}
          <div className="flex flex-col items-center">
            <h3 className="text-sm text-muted-foreground mb-4 font-medium">Current Balance</h3>
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
                <circle
                  cx="64" cy="64" r="56"
                  stroke={isNegative ? "#ef4444" : "hsl(var(--primary))"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * 0.25}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${isNegative ? 'text-red-500' : 'text-foreground'}`}>
                  {isNegative ? '-' : ''}₹{formattedBalance}
                </span>
                {/* Show the starting balance info slightly smaller */}
                <span className="text-[10px] text-muted-foreground mt-1">
                   (Starts at ₹{STARTING_BALANCE.toLocaleString('en-IN')})
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline">Reorder widgets</Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Transaction
            </Button>
          </div>
        </div>

        {/* --- GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: Recent Transactions */}
          <div className="lg:col-span-1">
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border h-full flex flex-col">
              <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
              
              <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No transactions yet.</p>
                ) : (
                  transactions.map((t) => (
                    <div key={t._id} className="group flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors border-b last:border-0 border-border">
                      <div className="flex gap-3 items-center">
                        <div className={`p-2 rounded-full ${t.type === 'Income' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {t.type === 'Income' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()} • {t.category || 'General'}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className={`font-bold text-sm ${t.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {t.type === 'Income' ? '+' : ''}₹{Math.abs(t.amount).toLocaleString('en-IN')}
                        </span>
                        <button 
                          onClick={() => handleDelete(t._id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Static Widgets */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <BudgetWidget />
              <SavingsGoal />
            </div>
          </div>

          {/* COLUMN 3: Static Analytics */}
          <div className="lg:col-span-1">
            <AnalyticsWidget />
          </div>
        </div>

        {/* Floating Add Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-40"
        >
          <Plus className="w-6 h-6 text-primary-foreground" />
        </button>

        {/* --- MODAL FORM --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-card text-card-foreground p-6 rounded-xl shadow-2xl w-full max-w-md border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">New Transaction</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Amount</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Type</label>
                    <select
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Expense">Expense</option>
                      <option value="Income">Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Category</label>
                    <select
                      className="w-full p-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="General">General</option>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Rent">Rent</option>
                      <option value="Salary">Salary</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground">
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Transactions;