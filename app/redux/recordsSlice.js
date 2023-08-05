import { createSlice } from '@reduxjs/toolkit'

export const recordsSlice = createSlice({
  name: 'records',
  initialState: {
    loaded: false,
    loading: false,
    error: null,
    data: []
  },
  reducers: {
    startLoading: (state, action) => {
      state.loading = true
    },
    endLoading: (state, action) => {
      state.loaded = true
      state.loading = false
    },
    endLoadingWithError: (state, action) => {
      const error = action.payload

      state.loading = false
      state.error = error
    },
    insertRecord: (state, action) => {
      const record = action.payload

      if (state.data.find(entry => entry.fileNumber === record.fileNumber))
        return state

      state.data.push(record)
    },
    updateRecord: (state, action) => {
      const { id, key, value } = action.payload
      const index = state.data.findIndex(record => record.id === id)

      state.data[index][key] = value
    },
    deleteRecord: (state, action) => {
      const id = action.payload

      state.data.splice(id, 1)
    }
  }
})

export const { startLoading, endLoading, endLoadingWithError, insertRecord, updateRecord, deleteRecord } = recordsSlice.actions
export default recordsSlice.reducer
