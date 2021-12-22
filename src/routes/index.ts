import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import cpflRoutes from './cpflRoutes'
import cpflSearchRoutes from './cpflSearchRoutes'

const routes = Router()

cpflRoutes(routes)
cpflSearchRoutes(routes)

export default routes