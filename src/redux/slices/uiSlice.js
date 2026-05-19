// uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: localStorage.getItem('prolink_theme') || 'light',
    sidebarOpen: false,
    mobileMenuOpen: false,
    globalLoading: false,
    modal: { isOpen: false, type: null, data: null },
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('prolink_theme', state.theme)
      document.documentElement.classList.toggle('dark', state.theme === 'dark')
    },
    setTheme: (state, { payload }) => {
      state.theme = payload
      localStorage.setItem('prolink_theme', payload)
      document.documentElement.classList.toggle('dark', payload === 'dark')
    },
    toggleSidebar:    (state) => { state.sidebarOpen = !state.sidebarOpen },
    setSidebar:       (state, { payload }) => { state.sidebarOpen = payload },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    setGlobalLoading: (state, { payload }) => { state.globalLoading = payload },
    openModal:  (state, { payload }) => { state.modal = { isOpen: true, ...payload } },
    closeModal: (state) => { state.modal = { isOpen: false, type: null, data: null } },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, setSidebar, toggleMobileMenu, setGlobalLoading, openModal, closeModal } = uiSlice.actions
export const selectTheme       = (state) => state.ui.theme
export const selectSidebar     = (state) => state.ui.sidebarOpen
export const selectModal       = (state) => state.ui.modal
export default uiSlice.reducer

// ─── jobSlice.js ───────────────────────────────────────────────────────────────
export { default as jobSlice } from './jobSlice'
