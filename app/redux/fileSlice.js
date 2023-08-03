import { createSlice } from '@reduxjs/toolkit'

export const fileSlice = createSlice({
  name: 'file',
  initialState: {},
  reducers: {
    newFile: (state, action) => {
      return {
        fileNumber: '',
        personName: '',
        phoneNumber: '',
        prisonTime: {
          years: 0,
          months: 0,
          days: 0
        },
        punishment: 'suspendare',
        probation: {
          years: 0,
          months: 0
        },
        expiration: '',
        judicialObligations: [],
        civilObligations: []
      }
    },
    openFile: (state, action) => {
      const file = action.payload

      return {
        id: file.id,
        fileNumber: file.fileNumber,
        personName: file.personName,
        phoneNumber: file.phoneNumber,
        prisonTime: file.prisonTime,
        punishment: file.punishment,
        probation: file.probation,
        expiration: file.expiration,
        judicialObligations: file.judicialObligations,
        civilObligations: file.civilObligations
      }
    },
    updateKey: (state, action) => {
      const [key, value] = action.payload

      if (!(key in state)) return state

      return { ...state, [key]: value }
    },
    closeFile: (state, action) => {
      return {}
    }
  }
})

export const { newFile, openFile, updateKey, closeFile } = fileSlice.actions
export default fileSlice.reducer
