import { createSlice } from '@reduxjs/toolkit'

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    filters: {
      search: '',
      category: '',
      type: '',
      locationType: '',
      location: '',
      minExp: '',
      maxExp: '',
      minSalary: '',
      maxSalary: '',
      skills: [],
      sort: '-createdAt',
    },
    currentPage: 1,
    viewedJob: null,
  },
  reducers: {
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
      state.currentPage = 1
    },
    resetFilters: (state) => {
      state.filters = jobSlice.getInitialState().filters
      state.currentPage = 1
    },
    setPage: (state, { payload }) => { state.currentPage = payload },
    setViewedJob: (state, { payload }) => { state.viewedJob = payload },
  },
})

export const { setFilters, resetFilters, setPage, setViewedJob } = jobSlice.actions
export const selectFilters = (state) => state.jobs.filters
export const selectPage    = (state) => state.jobs.currentPage
export default jobSlice.reducer
