import CronJob from 'cron'
import dotenv from 'dotenv'

import { cpflController } from './../controllers'

dotenv.config()

async function routine() {
  console.log(`iniciando rotina da CPFL`)

  await cpflController.runCpflRoutine('sp', 'Araraquara')

  console.log(`finalizando rotina da CPFL`)
}

export default async () => {
  const initialRoutine = new CronJob.CronJob('0 0 * * *', async () => {
    await routine()
  })

  const eightAmRoutine = new CronJob.CronJob('0 10 * * *', async () => {
    await routine()
  })

  const sixPmRoutin = new CronJob.CronJob('0 18 * * *', async () => {
    await routine()
  })

  initialRoutine.start()
  eightAmRoutine.start()
  sixPmRoutin.start()
}