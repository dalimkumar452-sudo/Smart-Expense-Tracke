import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  // Form States
  const [transactionType, setTransactionType] = useState('Expense'); 
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Auto-Detect');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [activeTab, setActiveTab] = useState('Dashboard'); 
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'INR'); // Default INR kore dilam chobir moto
  const navigate = useNavigate();

  const expenseCategories = ['Food', 'Utilities', 'Transport', 'Entertainment', 'Health', 'Other', 'Auto-Detect'];
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Other', 'Auto-Detect'];
  const currentCategories = transactionType === 'Expense' ? expenseCategories : incomeCategories;

  const currencies = {
    USD: { symbol: '$', rate: 1 },
    BDT: { symbol: '৳', rate: 110 },
    INR: { symbol: '₹', rate: 83 },
    EUR: { symbol: '€', rate: 0.92 }
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const getAmount = (val) => (val * currencies[currency].rate).toFixed(0);
  const curSymbol = currencies[currency].symbol;

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (!name) {
      navigate('/');
    } else {
      setUserName(name);
      fetchTransactions(name);
    }
  }, [navigate]);

  const fetchTransactions = async (name) => {
    try {
      const response = await fetch(`http://localhost:5000/get-expenses/${name}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!title || !amount || !date) {
        alert("Please fill all the fields including Description!");
        return;
    }

    const baseAmount = Number(amount) / currencies[currency].rate;

    try {
      const response = await fetch('http://localhost:5000/add-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userName, 
          type: transactionType, 
          title, 
          amount: baseAmount, 
          category, 
          date 
        })
      });

      if (response.ok) {
        const newData = await response.json();
        // Immediately update state so it shows without reloading
        setTransactions([newData, ...transactions]);
        setTitle('');
        setAmount('');
        alert("✅ Transaction Added Successfully!");
      } else {
        alert("❌ Error: Could not save data to database.");
      }
    } catch (error) {
      alert("❌ Server Error: Is your backend running?");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate('/');
  };

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpense;
  
  // Budget Alert Calculation (Dummy limit of 50,000 for visuals)
  const budgetLimitBase = 50000 / currencies[currency].rate;
  const expensePercentage = totalExpense > 0 ? ((totalExpense / budgetLimitBase) * 100).toFixed(0) : 0;

  // Chart Data
  const lineChartData = [...transactions].reverse().map(t => ({
    name: t.title,
    Income: t.type === 'Income' ? Number(getAmount(t.amount)) : 0,
    Expense: t.type === 'Expense' ? Number(getAmount(t.amount)) : 0,
    date: new Date(t.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  })); 

  const pieDataMap = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + curr.amount;
    return acc;
  }, {});
  
  const pieData = Object.keys(pieDataMap).map(key => ({
    name: key,
    value: Number(getAmount(pieDataMap[key]))
  }));
  const PIE_COLORS = ['#10B981', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#3B82F6'];

  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans text-gray-200 selection:bg-indigo-500/30 pb-20">
      
      {/* Navbar */}
      <nav className="bg-[#111827] border-b border-gray-800 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center">
          
          <div className="flex items-center gap-2 mb-4 md:mb-0 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Smart Expense Tracker
            </h1>
          </div>
          
          <div className="flex items-center space-x-8 text-sm font-medium text-gray-400">
            <button onClick={() => setActiveTab('Dashboard')} className={`flex items-center gap-2 hover:text-white transition-colors ${activeTab === 'Dashboard' ? 'text-indigo-400' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> Dashboard
            </button>
            <button onClick={() => setActiveTab('Budgets')} className={`flex items-center gap-2 hover:text-white transition-colors ${activeTab === 'Budgets' ? 'text-indigo-400' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> Budgets
            </button>
            <button onClick={() => setActiveTab('Import')} className={`flex items-center gap-2 hover:text-white transition-colors ${activeTab === 'Import' ? 'text-indigo-400' : ''}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> Import
            </button>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white">{userName}</p>
              <p className="text-xs text-indigo-400">{currency} Base</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white ml-2 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        
        {/* Header Area */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Financial Dashboard</h2>
            <p className="text-gray-400 text-sm">Welcome back, <span className="text-indigo-400 font-semibold">{userName}</span>. Let's analyze your savings.</p>
          </div>
          <button onClick={() => fetchTransactions(userName)} className="flex items-center gap-2 text-xs font-semibold bg-gray-800/50 hover:bg-gray-800 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Sync Data
          </button>
        </div>

        {activeTab === 'Dashboard' ? (
          <div>
            
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-5 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-2xl"></div>
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Total Income</p>
                  <p className="text-3xl font-bold text-white">{curSymbol}{getAmount(totalIncome)}</p>
                </div>
              </div>

              <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl"></div>
                <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-white">{curSymbol}{getAmount(totalExpense)}</p>
                </div>
              </div>

              <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-sm flex items-center gap-5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>
                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Net Balance</p>
                  <p className="text-3xl font-bold text-white">{curSymbol}{getAmount(netBalance)}</p>
                </div>
              </div>
            </div>

            {/* Active Budget Alerts (Exact match with your image) */}
            {totalExpense > 0 && (
              <div className="bg-[#1e1713] border border-[#3a2818] rounded-xl p-5 mb-8 shadow-md">
                <div className="flex items-center gap-2 text-amber-500 mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span className="font-bold text-sm">Active Budget Alerts (Exceeded {expensePercentage}% limit)</span>
                </div>
                <div className="bg-[#130f0c] border border-[#2b1f15] rounded-lg p-3 inline-block">
                  <span className="text-gray-400 text-sm">
                    Category <span className="text-white font-bold">Overall</span>: Spent {curSymbol}{getAmount(totalExpense)} of limit {curSymbol}{getAmount(budgetLimitBase)} ({expensePercentage}%)
                  </span>
                </div>
              </div>
            )}

            {/* Middle Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              
              {/* Add Transaction Panel */}
              <div className="lg:col-span-4 bg-[#111827] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-indigo-500 bg-indigo-500/10 rounded-full p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></span> 
                  Add Transaction
                </h3>
                
                <form onSubmit={handleAddTransaction} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                    <div className="flex bg-[#0B0F19] rounded-lg p-1 border border-gray-800">
                      <button type="button" onClick={() => setTransactionType('Expense')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${transactionType === 'Expense' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'text-gray-400 hover:text-white'}`}>Expense</button>
                      <button type="button" onClick={() => setTransactionType('Income')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${transactionType === 'Income' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-gray-400 hover:text-white'}`}>Income</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-2.5 text-gray-400">{curSymbol}</span>
                      <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#0B0F19] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Currency</label>
                      <select value={currency} onChange={handleCurrencyChange} className="w-full bg-[#0B0F19] border border-gray-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none">
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="BDT">BDT</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#0B0F19] border border-gray-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none">
                        {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-[#0B0F19] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 cursor-pointer [color-scheme:dark]" required />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <input type="text" placeholder="e.g. Starbucks Coffee" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#0B0F19] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" required />
                  </div>

                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">
                    Save Transaction
                  </button>
                </form>
              </div>

              {/* Charts Panel */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Doughnut Chart */}
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-6">Current Month Expenses</h3>
                  <div className="h-[250px] w-full">
                    {pieData.length === 0 ? (
                       <div className="h-full flex items-center justify-center text-gray-600 text-sm">No expenses yet</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          {/* InnerRadius 75 kore donut shape ta chobir moto mota kora holo */}
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={2} dataKey="value" stroke="none">
                            {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                          <Legend iconType="rect" wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Line Chart */}
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-6">6-Month Cashflow Trend</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                        <XAxis dataKey="date" axisLine={{stroke: '#374151'}} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} dy={10} />
                        <YAxis axisLine={{stroke: '#374151'}} tickLine={false} tick={{fill: '#6b7280', fontSize: 10}} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                        <Legend iconType="rect" wrapperStyle={{ fontSize: '11px' }} verticalAlign="top" height={36} />
                        <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2.5} dot={{r: 3, fill: '#10b981'}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2.5} dot={{r: 3, fill: '#ef4444'}} activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        ) : (
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-16 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{activeTab} feature coming soon!</h2>
            <button onClick={() => setActiveTab('Dashboard')} className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}