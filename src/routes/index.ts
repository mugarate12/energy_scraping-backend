import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import cpflRoutes from './cpflRoutes'
import cpflSearchRoutes from './cpflSearchRoutes'

const routes = Router()

cpflRoutes(routes)
cpflSearchRoutes(routes)

routes.get(`/`, async (req, res) => {
  return res.status(200).json({ message: 'API funcionando!' })
})

export default routes