import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { toast } from 'react-hot-toast';

export default function BookCard({ book }) {
  const imageUrl = book.imageUrl || 'https://placehold.co/400x600/e2e8f0/475569?text=Book+Cover';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <Link to={`/books/${book.id}`} className="block relative aspect-[2/3] overflow-hidden">
        <img src={imageUrl} alt={book.title} className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
        {book.type === 'SECOND_HAND' && (
          <span className="absolute top-2 left-2 bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
            Used - {book.condition?.replace('_', ' ')}
          </span>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">
          {book.categoryName}
        </div>
        <Link to={`/books/${book.id}`}>
          <h3 className="font-bold text-gray-900 line-clamp-1 hover:text-primary-600 transition-colors">{book.title}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-1 mb-3">{book.author}</p>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${book.sellingPrice?.toFixed(2)}</span>
            {book.originalPrice && book.originalPrice > book.sellingPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">${book.originalPrice?.toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={() => {
              useCartStore.getState().addToCart(book);
              toast.success('Added to cart');
            }}
            className="bg-primary-50 text-primary-600 p-2 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
