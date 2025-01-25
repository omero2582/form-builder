import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    showSidePanel: true,
    editField: undefined,
  };

export const general = createSlice({
  name: 'general',
  initialState,
  reducers: {
    toggleSidePanel: (state) => {
      state.showSidePanel = !state.showSidePanel
    },
    selectEditField: (state, {payload}) => {
      state.editField = payload
    }

  },
})

// Action creators are generated for each case reducer function
export const {toggleSidePanel, selectEditField} = general.actions

export default general.reducer