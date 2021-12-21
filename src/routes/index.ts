import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import cpflRoutes from './cpflRoutes'

const routes = Router()

cpflRoutes(routes)

export default routes