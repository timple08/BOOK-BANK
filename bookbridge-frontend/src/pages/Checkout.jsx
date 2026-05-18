import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.book.sellingPrice * item.quantity), 0);

  if (cart.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        shippingAddress: address,
        items: cart.map(item => ({ bookId: item.book.id, quantity: item.quantity }))
      };
      await api.post('/orders', payload);
      setSuccess(true);
      clearCart();
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 text-lg mb-8 max-w-md text-center">Thank you for your purchase. Your books will be shipped to your address shortly.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition">
          View My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5"/> Shipping Information</h2>
            <form id="checkout-form" onSubmit={handleCheckout}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Full Delivery Address</label>
                <textarea 
                  required 
                  rows="3"
                  className="w-full border-gray-300 rounded-lg border p-3 focus:ring-primary-500 focus:border-primary-500" 
                  placeholder="123 Main St, Apt 4B, City, Country, ZIP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5"/> Payment Method</h2>
            <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between cursor-pointer border-primary-500 ring-1 ring-primary-500">
              <div className="flex items-center gap-3">
                <input type="radio" checked readOnly className="text-primary-600 focus:ring-primary-500" />
                <span className="font-medium text-gray-900">Cash on Delivery (Mock)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.book.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1 flex-1 pr-2">{item.quantity}x {item.book.title}</span>
                  <span className="font-medium">${(item.book.sellingPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t mt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition disabled:bg-primary-400"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
