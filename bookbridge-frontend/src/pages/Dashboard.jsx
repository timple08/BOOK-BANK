import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Book, RefreshCw, Plus, Check, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('my_books');
  const [myBooks, setMyBooks] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const { user } = useAuthStore();

  const [newBook, setNewBook] = useState({
    title: '', author: '', isbn: '', description: '', categoryId: '', 
    condition: 'GOOD', sellingPrice: '', originalPrice: '', type: 'SECOND_HAND'
  });

  useEffect(() => {
    fetchData();
    api.get('/categories').then(res => setCategories(res.data));
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, incomingRes, outgoingRes, ordersRes] = await Promise.all([
        api.get('/books/my-listings'),
        api.get('/exchange/incoming'),
        api.get('/exchange/outgoing'),
        api.get('/orders')
      ]);
      setMyBooks(booksRes.data);
      setIncoming(incomingRes.data);
      setOutgoing(outgoingRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', newBook);
      toast.success('Book listed successfully!');
      setNewBook({ ...newBook, title: '', author: '', isbn: '', description: '', sellingPrice: '', originalPrice: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to list book');
    }
  };

  const respondToRequest = async (id, status) => {
    try {
      await api.put(`/exchange/${id}/respond?status=${status}`);
      toast.success(`Request ${status.toLowerCase()}!`);
      fetchData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Welcome, {user?.name}</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'my_books' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('my_books')}
          ><Book className="w-5 h-5 inline mr-2" /> My Listings</button>
          <button 
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'incoming' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('incoming')}
          ><RefreshCw className="w-5 h-5 inline mr-2" /> Incoming Requests</button>
          <button 
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'outgoing' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('outgoing')}
          ><RefreshCw className="w-5 h-5 inline mr-2" /> Outgoing Requests</button>
          <button 
            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'orders' ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('orders')}
          ><Check className="w-5 h-5 inline mr-2" /> My Orders</button>
        </div>

        <div className="p-6">
          {activeTab === 'my_books' && (
            <div>
              <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center"><Plus className="mr-2"/> List a Second-Hand Book</h3>
                <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Title" className="border p-2 rounded" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                  <input required placeholder="Author" className="border p-2 rounded" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                  <select required className="border p-2 rounded" value={newBook.categoryId} onChange={e => setNewBook({...newBook, categoryId: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="border p-2 rounded" value={newBook.condition} onChange={e => setNewBook({...newBook, condition: e.target.value})}>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                  </select>
                  <input required type="number" placeholder="Original Price" className="border p-2 rounded" value={newBook.originalPrice} onChange={e => setNewBook({...newBook, originalPrice: e.target.value})} />
                  <input required type="number" placeholder="Selling Price" className="border p-2 rounded" value={newBook.sellingPrice} onChange={e => setNewBook({...newBook, sellingPrice: e.target.value})} />
                  <textarea required placeholder="Description" className="border p-2 rounded md:col-span-2" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})} />
                  <button type="submit" className="md:col-span-2 bg-primary-600 text-white p-2 rounded font-bold hover:bg-primary-700">Post Book</button>
                </form>
              </div>

              <h3 className="text-lg font-bold mb-4">Your Active Listings</h3>
              {myBooks.length === 0 ? <p className="text-gray-500">You haven't listed any books yet.</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {myBooks.map(book => (
                    <div key={book.id} className="border p-4 rounded-xl flex justify-between items-center bg-white shadow-sm">
                      <div>
                        <div className="font-bold">{book.title}</div>
                        <div className="text-sm text-gray-500">${book.sellingPrice}</div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'incoming' && (
            <div className="space-y-4">
              {incoming.length === 0 ? <p className="text-gray-500">No incoming exchange requests.</p> : incoming.map(req => (
                <div key={req.id} className="border p-4 rounded-xl flex flex-col md:flex-row justify-between items-center bg-gray-50">
                  <div className="mb-4 md:mb-0">
                    <p><strong>{req.proposerName}</strong> wants to exchange their <strong>{req.offeredBookTitle}</strong> for your <strong>{req.requestedBookTitle}</strong>.</p>
                    <p className="text-sm text-gray-500 mt-1">Status: <span className="font-bold">{req.status}</span></p>
                  </div>
                  {req.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button onClick={() => respondToRequest(req.id, 'ACCEPTED')} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"><Check className="w-4 h-4 mr-1"/> Accept</button>
                      <button onClick={() => respondToRequest(req.id, 'REJECTED')} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700"><X className="w-4 h-4 mr-1"/> Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'outgoing' && (
            <div className="space-y-4">
              {outgoing.length === 0 ? <p className="text-gray-500">No outgoing exchange requests.</p> : outgoing.map(req => (
                <div key={req.id} className="border p-4 rounded-xl bg-gray-50">
                  <p>You requested <strong>{req.requestedBookTitle}</strong> from <strong>{req.targetUserName}</strong> in exchange for your <strong>{req.offeredBookTitle}</strong>.</p>
                  <p className="text-sm mt-2">Status: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {req.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? <p className="text-gray-500">You haven't placed any orders yet.</p> : orders.map(order => (
                <div key={order.id} className="border p-6 rounded-xl bg-gray-50">
                  <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
                      <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">{order.status}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold mb-2">Items:</p>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {order.items.map(item => (
                        <li key={item.id}>{item.quantity}x {item.bookTitle}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
