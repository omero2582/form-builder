import { Router } from "express";
import appleRouter from './apples.js'

const router = Router();

router.use('/apples', appleRouter)

export default router