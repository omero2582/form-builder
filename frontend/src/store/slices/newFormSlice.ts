import { createSlice } from '@reduxjs/toolkit'
import { FormSchema, defaultNewFieldsOldVersion, defaultNewFields, typeConfig } from '../../types';


const initialState: FormSchema = {
    name: 'Form',
    fields: defaultNewFields,
};

  // / DONE
  // - text input 
  //    .sting() = "string" | "number" | "email"  | "password" 
  //      | "textarea" | "select" | "checkbox" | "radio" | "date" | "file"
  // - datepicker
  // - textarea
  // - select dropdown
  // - radio buttons
  
  // TODO
  // ALLOW EDIT MIN MAX, AND LABEL
  // - checkbox

export const newForm = createSlice({
  name: 'newForm',
  initialState,
  reducers: {
    addText: (state) => {
      const newField = typeConfig.string.new();
      state.fields.push(newField)
    },
    addNumber: (state) => {
      const newField = typeConfig.number.new();
      state.fields.push(newField)
    },
    addTextArea: (state) => {
      const newField = typeConfig.textarea.new();
      state.fields.push(newField)
    },
    addDropbown: (state) => {
      const newField = typeConfig.select.new();
      state.fields.push(newField)
    },
    addRadioButtons: (state) => {
      const newField = typeConfig.radio.new();
      state.fields.push(newField)
    },
    addDate: (state) => {
      const newField = typeConfig.date.new();
      state.fields.push(newField)
    },
    updateFieldById: (state, {payload}) => {
      const {id, updatedField} = payload;
      const fieldFound = state.fields.find(f => f.id === id);
      Object.assign(fieldFound, updatedField);
    }

  },
})

// Action creators are generated for each case reducer function
export const {addText, addTextArea, updateFieldById, addDate,addDropbown, addNumber, addRadioButtons} = newForm.actions

export default newForm.reducer