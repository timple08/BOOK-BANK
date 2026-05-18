import { create } from 'zustand';

const useCartStore = create((set) => ({
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  addToCart: (book) => {
    set((state) => {
      const existing = state.cart.find(item => item.book.id === book.id);
      let newCart;
      if (existing) {
        newCart = state.cart.map(item => 
          item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newCart = [...state.cart, { book, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },
  removeFromCart: (bookId) => {
    set((state) => {
      const newCart = state.cart.filter(item => item.book.id !== bookId);
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },
  updateQuantity: (bookId, quantity) => {
    set((state) => {
      if (quantity <= 0) return state;
      const newCart = state.cart.map(item => 
        item.book.id === bookId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { cart: newCart };
    });
  },
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ cart: [] });
  }
}));

export default useCartStore;
