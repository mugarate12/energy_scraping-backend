import CronJob from 'cron'
import dotenv from 'dotenv'

import CPFLRoutine from './CPFLRoutine'

dotenv.config()

const processName = process.env.name || 'primary'

export default async () => {
  if(processName.search(/primary/) !== -1){
    await CPFLRoutine()
  } 
}
