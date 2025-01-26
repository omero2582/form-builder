import asyncHandler from "express-async-handler";
import Form from "../models/Form.js";
import { NotFoundError } from '../errors/errors.js'

export const getAllForms = asyncHandler(async (req, res) => {
  const forms = await Form.find();
  res.json({message: 'all forms!', forms})
})

export const newForm = asyncHandler(async (req, res) => {
  const {name, description, fields } = req.body
  const user = req.user

  const newForm = new Form({name, description, fields})
  const form = await newForm.save();
  return res.json({form, message: `new form`})
}) 

export const getForm = asyncHandler(async (req, res) => {
  const {id} = req.params

  const form = await Form.findById(id);
  if(!form){
    throw new NotFoundError(`Form Not Found`)
  }

  res.json({form, message: `retrieved form ${id}`})
}) 


export const updateForm = asyncHandler(async (req, res) => {
  const {id} = req.params
  const {name, description, fields } = req.body

  const form = await Form.findById(id);
  if(!form){
    throw new NotFoundError(`Form Not Found`)
  }

  form.name = name ?? form.name;
  form.description = description ?? form.description;
  form.fields = fields ?? form.fields;

  if (form.isModified()) {
    const newForm = await form.save();
    return res.json({ form: newForm, message: `updated form ${id}`});
  }

  res.json({form, message: `updated form ${id}`})
}) 


export const deleteForm = asyncHandler(async (req, res) => {
  const {id} = req.params

  const form = await Form.findById(id);
  if(!form){
    throw new NotFoundError(`Form Not Found`)
  }

  const result = await form.deleteOne();

  res.json({result, message: `updated form ${id}`})
}) 