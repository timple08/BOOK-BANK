import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import { BookOpen, LogOut, User as UserIcon, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">BookBridge</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/books" className="text-gray-600 hover:text-primary-600 font-medium">Browse</Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1">
                  <UserIcon className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-600 hover:text-red-600 font-medium">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
