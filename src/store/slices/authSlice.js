import { createSlice } from '@reduxjs/toolkit';

let storedUser = null;
try {
  const data = localStorage.getItem('userData');
  storedUser = data ? JSON.parse(data) : null;
} catch (error) {
  console.error('Error parsing userData from localStorage', error);
  localStorage.removeItem('userData');
}
const storedToken = localStorage.getItem('token');
const storedRole = localStorage.getItem('userRole');

const initialState = {
  isAuthenticated: !!storedToken,
  user: storedUser || null,
  role: storedRole || null,
  token: storedToken || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, role, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.role = role;
      state.token = token;
      state.loading = false;
      state.error = null;

      // Update localStorage
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
