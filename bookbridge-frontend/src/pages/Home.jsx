import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Book, Recycle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Buy, Sell & Exchange Books
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Your one-stop platform for new and second-hand books. Discover great reads, clear your shelves, and connect with fellow readers.
          </p>
          <div className="max-w-xl mx-auto bg-white rounded-full p-2 flex shadow-lg">
            <input 
              type="text" 
              placeholder="Search by title, author, or ISBN..." 
              className="flex-1 px-6 py-2 rounded-full focus:outline-none text-gray-900"
            />
            <button className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition flex items-center gap-2">
              <Search className="w-5 h-5" /> Search
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Buy New Books</h3>
            <p className="text-gray-600">Discover the latest bestsellers and classics fresh off the press.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">$</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Buy & Sell Used</h3>
            <p className="text-gray-600">Find great deals on pre-loved books or sell yours for cash.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Recycle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Exchange</h3>
            <p className="text-gray-600">Trade books with other readers in your community.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
