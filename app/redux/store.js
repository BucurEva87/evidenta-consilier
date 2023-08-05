import { configureStore } from '@reduxjs/toolkit'
import fileInProgressReducer from './fileInProgressSlice'
import recordsReducer from './recordsSlice'

const store = configureStore({
  reducer: {
    fileInProgress: fileInProgressReducer,
    records: recordsReducer
  }
})

export default store
