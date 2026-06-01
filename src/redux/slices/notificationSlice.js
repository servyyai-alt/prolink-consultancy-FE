import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0 },
  reducers: {
    setNotifications: (state, { payload }) => {
      state.items = payload?.notifications || []
      state.unreadCount = payload?.unreadCount || 0
    },
    addNotification: (state, { payload }) => {
      if (!payload?._id || state.items.some((item) => item._id === payload._id)) return
      state.items.unshift(payload)
      state.items = state.items.slice(0, 30)
      if (!payload.isRead) state.unreadCount += 1
    },
    markAllRead: (state) => {
      state.items = state.items.map(n => ({ ...n, isRead: true }))
      state.unreadCount = 0
    },
    markOneRead: (state, { payload }) => {
      const n = state.items.find(n => n._id === payload)
      if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1) }
    },
    clearNotifications: (state) => {
      state.items = []
      state.unreadCount = 0
    },
  },
})

export const { setNotifications, addNotification, markAllRead, markOneRead, clearNotifications } = notificationSlice.actions
export const selectNotifications = (state) => state.notifications.items
export const selectUnreadCount   = (state) => state.notifications.unreadCount
export default notificationSlice.reducer
