import { createSlice } from '@reduxjs/toolkit'
import { FormSchema, typeConfig } from '../../types';


const initialState: FormSchema = {
    name: 'Form',
    fields: [
      { type: "string", id: "firstName", placeholder: 'First Name',  required: true },
      { type: "number", id: "id", placeholder: 'id', required: true, min: 18 },
      { type: "email", id: "email", placeholder:'email', required: true },
      { type: "password", id: "password", placeholder:'password' }
      // / DONE
      // - text input 
      //    .sting() = "string" | "number" | "email"  | "password" 
      //      | "textarea" | "select" | "checkbox" | "radio" | "date" | "file"
      
      // TODO
      // - textarea
      // - select dropdown
      // - checkbox
      // - radio buttons
      // - datepicker

      // TOOD OT DO change above to justbe composed of a bunch of field.new() called 5 times or so to 
      // create the intiial state for 'Default New Form'
    ],
  };

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