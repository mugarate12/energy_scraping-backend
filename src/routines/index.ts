import CronJob from 'cron'
import dotenv from 'dotenv'

import CPFLRoutine from './CPFLRoutine'
import cleanTemporaryFilesRoutine from './clearTemporaryFilesRoutine'

dotenv.config()

const processName = process.env.name || 'primary'

export default async () => {
  if(processName.search(/primary/) !== -1){
    CPFLRoutine()
    cleanTemporaryFilesRoutine()
  } 
}
