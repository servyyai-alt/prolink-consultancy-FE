import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0 },
  reducers: {
    setNotifications: (state, { payload }) => {
      state.items = payload.notifications
      state.unreadCount = payload.unreadCount
    },
    addNotification: (state, { payload }) => {
      state.items.unshift(payload)
      state.unreadCount += 1
    },
    markAllRead: (state) => {
      state.items = state.items.map(n => ({ ...n, isRead: true }))
      state.unreadCount = 0
    },
    markOneRead: (state, { payload }) => {
      const n = state.items.find(n => n._id === payload)
      if (n && !n.isRead) { n.isRead = true; state.unreadCount = Math.max(0, state.unreadCount - 1) }
    },
  },
})

export const { setNotifications, addNotification, markAllRead, markOneRead } = notificationSlice.actions
export const selectNotifications = (state) => state.notifications.items
export const selectUnreadCount   = (state) => state.notifications.unreadCount
export default notificationSlice.reducer
