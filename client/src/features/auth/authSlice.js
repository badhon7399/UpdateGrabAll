import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

// Get user from localStorage
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const tokenFromStorage = localStorage.getItem('token') || null;

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!userFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // When login is fulfilled, set credentials
      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          
          localStorage.setItem('user', JSON.stringify(payload.user));
          localStorage.setItem('token', payload.token);
        }
      )
      // When register is fulfilled, set credentials
      .addMatcher(
        apiSlice.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.token = payload.token;
          state.isAuthenticated = true;
          
          localStorage.setItem('user', JSON.stringify(payload.user));
          localStorage.setItem('token', payload.token);
        }
      )
      // When logout is fulfilled, clear credentials
      .addMatcher(
        apiSlice.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      )
      // When update profile is fulfilled, update user
      .addMatcher(
        apiSlice.endpoints.updateProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          localStorage.setItem('user', JSON.stringify(payload.user));
        }
      );
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAdmin = (state) => 
  state.auth.user ? ['admin', 'super-admin'].includes(state.auth.user.role) : false;
