import { Router } from "express";
import { getAllApples, getApple } from "../controllers/apples.js";

const router = Router();

router.get('/',
  getAllApples
)

router.get('/:id', 
  getApple
)

export default router