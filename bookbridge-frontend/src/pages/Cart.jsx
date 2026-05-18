import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <ShoppingCart className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any books yet.</p>
        <Link to="/books" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          {cart.map(item => (
            <div key={item.book.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <img src={item.book.imageUrl || 'https://placehold.co/100x150'} alt={item.book.title} className="w-20 h-28 object-cover rounded-md" />
              <div className="flex-grow">
                <Link to={`/books/${item.book.id}`} className="font-bold text-lg text-gray-900 hover:text-primary-600">{item.book.title}</Link>
                <p className="text-gray-500 text-sm">{item.book.author}</p>
                <div className="text-primary-600 font-bold mt-2">${item.book.sellingPrice?.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => updateQuantity(item.book.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 font-bold">-</button>
                  <span className="px-3 font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.book.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100 font-bold">+</button>
                </div>
                <button onClick={() => removeFromCart(item.book.id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.reduce((a,c)=>a+c.quantity,0)} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
