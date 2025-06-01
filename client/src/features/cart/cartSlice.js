import { createSlice } from '@reduxjs/toolkit';

// Get cart items from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const paymentMethodFromStorage = localStorage.getItem('paymentMethod') || 'Cash on Delivery';

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      const existItem = state.cartItems.find(
        (x) => x.product === item.product
      );
      
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      
      // Calculate prices
      cartSlice.caseReducers.calculatePrices(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
      
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      
      // Calculate prices
      cartSlice.caseReducers.calculatePrices(state);
    },
    updateCartQuantity: (state, action) => {
      const { product, quantity } = action.payload;
      
      const item = state.cartItems.find((x) => x.product === product);
      
      if (item) {
        item.quantity = quantity;
      }
      
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      
      // Calculate prices
      cartSlice.caseReducers.calculatePrices(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      
      // Update localStorage
      localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      
      // Update localStorage
      localStorage.setItem('paymentMethod', action.payload);
    },
    calculatePrices: (state) => {
      // Calculate items price
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      
      // Calculate shipping price (free shipping for orders over 1000 BDT)
      state.shippingPrice = state.itemsPrice > 1000 ? 0 : 60;
      
      // Calculate tax price (15% VAT)
      state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));
      
      // Calculate total price
      state.totalPrice = (
        state.itemsPrice +
        state.shippingPrice +
        state.taxPrice
      ).toFixed(2);
    },
    clearCart: (state) => {
      state.cartItems = [];
      
      // Update localStorage
      localStorage.removeItem('cartItems');
      
      // Calculate prices
      cartSlice.caseReducers.calculatePrices(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartItemsCount = (state) => state.cart.cartItems.length;
export const selectCartTotalItems = (state) =>
  state.cart.cartItems.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalAmount = (state) => state.cart.totalPrice;
export const selectShippingAddress = (state) => state.cart.shippingAddress;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;
