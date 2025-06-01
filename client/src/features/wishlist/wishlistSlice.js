import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: localStorage.getItem('wishlist') 
    ? JSON.parse(localStorage.getItem('wishlist')) 
    : []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      // Check if item already exists in wishlist
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingIndex === -1) {
        state.items.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    }
  }
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistItemsCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (state, productId) => 
  state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;
