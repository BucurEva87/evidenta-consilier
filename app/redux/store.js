import { configureStore } from '@reduxjs/toolkit'
import fileReducer from './fileSlice'
import recordsReducer from './recordsSlice'

const store = configureStore({
  reducer: {
    file: fileReducer,
    records: recordsReducer
  }
})

export default store
