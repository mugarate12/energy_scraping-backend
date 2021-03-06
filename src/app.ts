import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { errors } from 'celebrate'
import swaggerUI from 'swagger-ui-express'

import routines from './routines'
import routes from './routes'

dotenv.config()
const app = express()
const server = http.createServer(app)

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['*'],
  exposedHeaders: ['Authorization', 'Content-Type', 'Content-Disposition', 'Access-Control-Allow-Headers', 'Origin', 'Accept', 'X-Requested-With', 'filename'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))

app.use(express.json())

app.use(routes)

// celebrate errors
app.use(errors())

// run routines
routines()

const PORT = !process.env.PORT ? 3335 :  process.env.PORT

server.listen(PORT, () => {
  const addressObject = server.address()
  if (typeof addressObject !== 'string' && addressObject !== null) {
    console.log(`listening at ${addressObject.address}, ${addressObject.port}`)
  }

  console.log(`listening on port ${PORT}`)
})