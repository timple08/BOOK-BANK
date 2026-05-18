import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import { Filter } from 'lucide-react';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    type: 'ALL', // ALL, NEW, SECOND_HAND
    categoryId: 'ALL'
  });

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, [filters.type]); // Refetch if type changes from backend filter

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let url = '/books';
      if (filters.type !== 'ALL') {
        url += `?type=${filters.type}`;
      }
      const res = await api.get(url);
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    if (filters.categoryId !== 'ALL' && book.categoryName !== categories.find(c => c.id.toString() === filters.categoryId)?.name) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-lg mb-6 border-b pb-4">
              <Filter className="w-5 h-5" /> Filters
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-700">Book Type</h3>
              <div className="space-y-2">
                {['ALL', 'NEW', 'SECOND_HAND'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filters.type === type}
                      onChange={() => setFilters({...filters, type})}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">
                      {type === 'ALL' ? 'All Books' : type === 'NEW' ? 'New Books' : 'Second Hand'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-gray-700">Category</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={filters.categoryId === 'ALL'}
                    onChange={() => setFilters({...filters, categoryId: 'ALL'})}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-700">All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={filters.categoryId === category.id.toString()}
                      onChange={() => setFilters({...filters, categoryId: category.id.toString()})}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
