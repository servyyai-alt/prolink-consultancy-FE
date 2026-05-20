import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TOKEN_KEY = 'prolink_access_token'
const REFRESH_KEY = 'prolink_refresh_token'
const USER_KEY = 'prolink_user'

// Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/verify-otp', payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed')
  }
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me')
    return data.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout')
  } catch (_) {}
})

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    accessToken: localStorage.getItem(TOKEN_KEY) || null,
    isLoading:   false,
    isInitialized: false,
    error:       null,
    pendingEmail: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user
      state.accessToken = payload.accessToken
      localStorage.setItem(TOKEN_KEY, payload.accessToken)
      localStorage.setItem(REFRESH_KEY, payload.refreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_KEY)
      localStorage.removeItem(USER_KEY)
    },
    setPendingEmail: (state, { payload }) => { state.pendingEmail = payload },
    updateUser: (state, { payload }) => {
      state.user = { ...state.user, ...payload }
      localStorage.setItem(USER_KEY, JSON.stringify(state.user))
    },
    setInitialized: (state) => { state.isInitialized = true },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending,   (state) => { state.isLoading = true;  state.error = null })
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.user = payload.user
      state.accessToken = payload.accessToken
      localStorage.setItem(TOKEN_KEY, payload.accessToken)
      localStorage.setItem(REFRESH_KEY, payload.refreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      toast.success('Welcome back! 👋')
    })
    builder.addCase(loginUser.rejected,  (state, { payload }) => {
      state.isLoading = false; state.error = payload; toast.error(payload)
    })

    // Register
    builder.addCase(registerUser.pending,   (state) => { state.isLoading = true; state.error = null })
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.isLoading = false
      const authData = payload?.data || payload

      // OTP flow is temporarily bypassed. Keep the old pending-email flow commented for later reuse.
      // state.pendingEmail = payload.data?.email
      if (authData?.user && authData?.accessToken) {
        state.user = authData.user
        state.accessToken = authData.accessToken
        state.pendingEmail = null
        localStorage.setItem(TOKEN_KEY, authData.accessToken)
        if (authData.refreshToken) localStorage.setItem(REFRESH_KEY, authData.refreshToken)
        localStorage.setItem(USER_KEY, JSON.stringify(authData.user))
        toast.success('Account created successfully!')
      } else {
        toast.success('Registration submitted successfully. Please sign in.')
      }
    })
    builder.addCase(registerUser.rejected,  (state, { payload }) => {
      state.isLoading = false; state.error = payload; toast.error(payload)
    })

    // Verify OTP
    builder.addCase(verifyOTP.pending,   (state) => { state.isLoading = true })
    builder.addCase(verifyOTP.fulfilled, (state, { payload }) => {
      state.isLoading = false
      state.user = payload.user
      state.accessToken = payload.accessToken
      state.pendingEmail = null
      localStorage.setItem(TOKEN_KEY, payload.accessToken)
      localStorage.setItem(REFRESH_KEY, payload.refreshToken)
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      toast.success('Email verified! Welcome to ProLink 🎉')
    })
    builder.addCase(verifyOTP.rejected,  (state, { payload }) => {
      state.isLoading = false; state.error = payload; toast.error(payload)
    })

    // GetMe
    builder.addCase(getMe.fulfilled, (state, { payload }) => {
      state.user = payload; state.isInitialized = true
      localStorage.setItem(USER_KEY, JSON.stringify(payload))
    })
    builder.addCase(getMe.rejected, (state) => { state.isInitialized = true })

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null; state.accessToken = null
      localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); localStorage.removeItem(USER_KEY)
    })
  },
})

export const { setCredentials, clearCredentials, setPendingEmail, updateUser, setInitialized } = authSlice.actions

// Selectors
export const selectAuth        = (state) => state.auth
export const selectUser        = (state) => state.auth.user
export const selectIsLoggedIn  = (state) => !!state.auth.user
export const selectRole        = (state) => state.auth.user?.role
export const selectIsAdmin     = (state) => ['admin', 'super_admin'].includes(state.auth.user?.role)
export const selectAccessToken = (state) => state.auth.accessToken

export default authSlice.reducer
