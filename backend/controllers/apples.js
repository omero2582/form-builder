import asyncHandler from "express-async-handler";

export const getAllApples = asyncHandler((req, res) => {
  res.json({message: 'all apples!'})
})

export const getApple = asyncHandler((req, res) => {
  const {id} = req.params
  res.json({message: `retrieved apple ${id}`})
}) 