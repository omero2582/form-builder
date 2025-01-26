import './config/env.js';
import './config/database.js'

import express from 'express'
import asyncHandler from 'express-async-handler'
import indexRouter from './routes/index.js'


const app = express();
const port = 3000

app.use(express.json());
app.get('/', (req, res) => {
  res.json({message: 'Hello World!'})
})

app.get('/error', asyncHandler(async (req, res) => {
  throw new Error('asyncError')
  res.json({message: 'Hello World!'})
}))

app.use('/api', indexRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500)
    .json({
        ...err,
        message: err.message,
        test: 'catch-all'
    })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})