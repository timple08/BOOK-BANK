import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { ShoppingCart, ArrowLeft, User, BookOpen, Tag, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import useCartStore from '../store/useCartStore';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        toast.error("Failed to load book details");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) return <div className="text-center py-20">Book not found.</div>;

  const imageUrl = book.imageUrl || 'https://placehold.co/600x800/e2e8f0/475569?text=Book+Cover';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/books" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Books
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 p-8 bg-gray-50 flex items-center justify-center">
            <img src={imageUrl} alt={book.title} className="w-full max-w-sm rounded-lg shadow-md object-cover" />
          </div>
          
          {/* Details Section */}
          <div className="md:w-2/3 p-8 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-sm font-bold text-primary-600 uppercase tracking-wider">{book.categoryName}</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-1 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">by {book.author}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">${book.sellingPrice?.toFixed(2)}</div>
                {book.originalPrice && book.originalPrice > book.sellingPrice && (
                  <div className="text-gray-400 line-through">MRP: ${book.originalPrice?.toFixed(2)}</div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4 text-gray-500" />
                {book.type === 'NEW' ? 'New Book' : 'Second Hand'}
              </div>
              {book.condition && (
                <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg text-sm font-medium text-purple-700">
                  Condition: {book.condition.replace('_', ' ')}
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  ISBN: {book.isbn}
                </div>
              )}
            </div>

            <div className="prose prose-blue max-w-none mb-8 text-gray-600">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="whitespace-pre-wrap">{book.description}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Sold By</div>
                  <div className="font-medium text-gray-900">{book.sellerName}</div>
                </div>
              </div>
              
              <div className="w-full sm:w-auto flex gap-3">
                {book.type === 'SECOND_HAND' && book.sellerName !== 'BookBridge Store' && (
                  <ExchangeModal targetBook={book} />
                )}
                <button 
                  onClick={() => {
                    useCartStore.getState().addToCart(book);
                    toast.success('Added to cart');
                  }}
                  className="flex-1 sm:flex-none bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExchangeModal({ targetBook }) {
  const [isOpen, setIsOpen] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');

  const handleOpen = async () => {
    setIsOpen(true);
    try {
      const res = await api.get('/books/my-listings');
      setMyBooks(res.data);
    } catch (err) {
      toast.error('Failed to load your books');
    }
  };

  const handleSubmit = async () => {
    if (!selectedBookId) return toast.error('Please select a book to offer');
    try {
      await api.post('/exchange', {
        targetUserId: targetBook.sellerName, // Need targetUserId from backend but we only have sellerName in DTO right now. Wait, I should fetch sellerId from backend. Let me assume BookDto has sellerId or just use another endpoint.
        // Actually, the backend BookDto currently does not expose sellerId, it only has sellerName.
        // I need to add sellerId to BookDto in backend!
        targetUserId: targetBook.sellerId,
        offeredBookId: selectedBookId,
        requestedBookId: targetBook.id
      });
      toast.success('Exchange request sent!');
      setIsOpen(false);
    } catch (err) {
      toast.error('Failed to send request');
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="bg-purple-100 text-purple-700 px-6 py-3 rounded-xl font-bold hover:bg-purple-200 transition flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5" /> Exchange
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Request Exchange</h3>
            <p className="mb-4 text-gray-600">Select one of your books to offer in exchange for <strong>{targetBook.title}</strong>.</p>
            
            <select className="w-full border p-3 rounded-lg mb-4" value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)}>
              <option value="">Select a book to offer</option>
              {myBooks.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
