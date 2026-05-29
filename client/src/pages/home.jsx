import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

export default function Home() {
  const navigate = useNavigate(); 
  
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2024-10-01', description: 'Food', amount: 50 },
    { id: 2, date: '2024-10-05', description: 'Transport', amount: 20 },
    { id: 3, date: '2024-10-10', description: 'Entertainment', amount: 30 },
    { id: 4, date: '2024-10-12', description: 'Groceries', amount: 40 },
  ]);

  const handleComingSoon = (e) => {
    e.preventDefault();
    alert("🚀 This feature will be added very soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Navbar Section */}
      <nav className="bg-[#1877f2] text-white py-4 px-6 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">Smart Expense Tracker</h1>
        <div className="flex justify-center space-x-6 text-sm font-medium">
          {/* Working Links */}
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/dashboard" className="hover:underline">Expense Tracker</Link>
          <Link to="/" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          
          {/* Coming Soon Links */}
          <a href="#" onClick={handleComingSoon} className="hover:underline">User Profile</a>
          <a href="#" onClick={handleComingSoon} className="hover:underline">Analytics</a>
          <a href="#" onClick={handleComingSoon} className="hover:underline">Settings</a>
          <a href="#" onClick={handleComingSoon} className="hover:underline">Help/FAQ</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-gray-200 py-16 text-center rounded-lg shadow-sm border border-gray-300">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">Welcome to Your Personal Finance Assistant!</h2>
          <p className="text-gray-600 mb-6">Track your expenses easily and efficiently.</p>
          <button 
            onClick={() => navigate('/register')} 
            className="bg-[#28a745] hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Expense Tracking', 'Budget Planning', 'Financial Tips', 'Data Analytics'].map((feature, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 p-6 rounded shadow-sm text-center font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer" onClick={handleComingSoon}>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">User Testimonials</h3>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#1877f2]">
            <p className="text-gray-600 italic">"This app has changed the way I manage my finances!"</p>
            <p className="text-sm font-semibold text-gray-800 mt-2">- User A</p>
          </div>
          <div className="bg-white p-4 rounded shadow-sm border-l-4 border-[#1877f2]">
            <p className="text-gray-600 italic">"I saved so much money after using this app!"</p>
            <p className="text-sm font-semibold text-gray-800 mt-2">- User B</p>
          </div>
        </div>
      </div>

      {/* Add New Expense Section */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Expense</h3>
        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col md:flex-row gap-4 items-center w-full max-w-2xl">
            <input 
              type="number" 
              placeholder="Amount" 
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            <input 
              type="text" 
              placeholder="Description" 
              className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-[#28a745] hover:bg-green-600 text-white font-semibold py-2 px-8 rounded whitespace-nowrap shadow transition-colors"
            >
              Add<br/>Expense
            </button>
          </div>
        </div>
      </div>

      {/* Expense List Section */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-white border border-gray-200 p-4 rounded shadow-sm flex justify-between items-center text-gray-700">
              <div>{expense.date} - {expense.description}</div>
              <div>${expense.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="max-w-7xl mx-auto px-4 mt-10 mb-10">
        <div className="bg-gray-100 py-10 text-center rounded-lg shadow-sm border border-gray-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Start Tracking Your Expenses Today!</h2>
          <button 
            onClick={() => navigate('/register')} 
            className="bg-[#28a745] hover:bg-green-600 text-white font-semibold py-2 px-8 rounded shadow transition-colors"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#1877f2] text-white text-center py-6">
        <p className="font-semibold mb-1">Follow us on social media!</p>
        <p className="text-sm">Contact: <a href="mailto:info@expense-tracker.com" className="underline hover:text-gray-200">info@expense-tracker.com</a></p>
      </footer>

    </div>
  );
}