import { createSlice } from '@reduxjs/toolkit'

export const fileInProgressSlice = createSlice({
  name: 'file',
  initialState: {
    index: 0,
    data: {}
  },
  reducers: {
    newFile: (state, action) => {
      state.data = {
        fileNumber: '',
        name: '',
        dateOfBirth: Number(new Date()),
        emailAddress: '',
        phoneNumber: '',
        minorFellon: 0,
        educativeMeasures: [],
        prisonTime: {
          years: 0,
          months: 0,
          days: 0
        },
        punishment: 'suspendare',
        sentenceDate: '',
        probation: {
          years: 0,
          months: 0
        },
        expiration: '',
        obligations: [],
        civilObligations: 0
      }
    },
    openFile: (state, action) => {
      const file = action.payload

      state.data = {
        id: file.id,
        fileNumber: file.fileNumber,
        name: file.name,
        dateOfBirth: file.dateOfBirth,
        emailAddress: file.emailAddress,
        phoneNumber: file.phoneNumber,
        minorFellon: file.minorFellon,
        educativeMeasures: file.educativeMeasures,
        prisonTime: file.prisonTime,
        punishment: file.punishment,
        sentenceDate: file.sentenceDate,
        probation: file.probation,
        expiration: file.expiration,
        obligations: file.obligations,
        civilObligations: file.civilObligations,
        createdAt: Number(new Date()),
        updatedAt: 0
      }
    },
    updateKey: (state, action) => {
      const { key, value } = action.payload

      if (!(key in state.data)) return state

      state.data = { ...state.data, [key]: value }
    },
    closeFile: (state, action) => {
      state.index = state.index + 1
    }
  }
})

export const { newFile, openFile, updateKey, closeFile } = fileInProgressSlice.actions
export default fileInProgressSlice.reducer
