import { Knex } from 'knex'
import moment from 'moment'

import { AppError } from './../utils'
const connection: Knex<any, unknown[]> = require('./../database')
const { 
  CPFL_SEARCH
} = require('./../database/types')

interface CPFFSearchInterface {
  id: number,
  state: string,
  city: string
}

export default class CPFLSearchRepository {
  private reference = () => connection<CPFFSearchInterface>(CPFL_SEARCH)
}