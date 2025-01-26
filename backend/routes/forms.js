import { Router } from "express";
import { deleteForm, getAllForms, getForm, newForm, updateForm } from "../controllers/forms.js";

const router = Router();

router.get('/',
  getAllForms
)

router.post('/', 
  newForm
)

router.get('/:id', 
  getForm
)

router.patch('/:id', 
  updateForm
)

router.delete('/:id', 
  deleteForm
)

export default router