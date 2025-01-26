import { Router } from "express";
import formRouter from './forms.js'

const router = Router();

router.use('/forms', formRouter)
// router.use('/forms', authMandatory, formRouter)  //auth protected

export default router