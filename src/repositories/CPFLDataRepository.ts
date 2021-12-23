import { Knex } from 'knex'
import moment from 'moment'

import { AppError } from './../utils'
const connection: Knex<any, unknown[]> = require('./../database')
const { 
  CPFL_DATA
} = require('./../database/types')

interface CPFLDataInterface {
  id: number,

  state: string,
  city: string,
  district: string,
  street: string,

  status: number,

  date: string,

  initial_hour: string,
  final_hour: string,
  duration: string,

  final_seconds: number,
  final_maintenance: number
}

interface createCPFLDataInterface {
  state: string,
  city: string,
  district: string,
  street: string,

  status: number,

  date: string,
  
  initial_hour: string,
  final_hour: string,
  duration: string,

  final_seconds: number,
  final_maintenance: number
}

interface getCPFLDataInterface {
  state: string,
  city: string,
  district: string,
  street: string,

  date: string,
}

interface updateCPFLDataInterface {
  identifiers: {
    id: number
  },
  payload: {
    final_seconds?: number,
    final_maintenance?: number,
    status?: number
  }
}

export default class CPFLDataRepository {
  private reference = () => connection<CPFLDataInterface>(CPFL_DATA)

  public create = async ({ state, city, district, street, status, date, initial_hour, final_hour, duration, final_seconds, final_maintenance }: createCPFLDataInterface) => {
    return await this.reference()
      .insert({ state, city, district, street, status, date, initial_hour, final_hour, duration, final_seconds, final_maintenance })
      .then(() => {
        return
      })
      .catch(error => {
        throw new AppError('Database Error', 406, error.message, true)
      })
  }

  public get = async ({ state, city, district, street, date }: getCPFLDataInterface) => {
    return await this.reference()
      .where({ state, city, district, street, date })
      .select('*')
      .first()
      .then(cpflData => cpflData)
      .catch(error => {
        throw new AppError('Database Error', 406, error.message, true)
      })
  }

  public update = async ({ identifiers, payload }: updateCPFLDataInterface) => {
    let query = this.reference()
    let updatePayload: updateCPFLDataInterface['payload'] = {}

    if (!!identifiers.id) {
      query = query.where('id', '=', identifiers.id)
    }

    if (!!payload) {
      if (!!payload.final_seconds) {
        updatePayload.final_seconds = payload.final_seconds
      }

      if (!!payload.final_maintenance) {
        updatePayload.final_maintenance = payload.final_maintenance
      }

      if (!!payload.status) {
        updatePayload.status = payload.status
      }
    }

    return await query
      .update(updatePayload)
      .then(() => {
        return 
      })
      .catch(error => {
        throw new AppError('Database Error', 406, error.message, true)
      })
  }
}