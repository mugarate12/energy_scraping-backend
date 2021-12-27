import fs from 'fs'
import CronJob from 'cron'

function cleanTemporaryFiles() {
  const isLinux = process.platform === 'darwin' || process.platform === 'linux'

  if (isLinux) {
    let filesList = fs.readdirSync('/tmp')
    // console.log(filesList)
    
    filesList.forEach((file) => {
      const isTemporaryFileOfPuppeteer = file.includes('puppeteer_dev_chrome_profile-')
      const isTemporaryFileOfChromium = file.includes('.org.chromium.Chromium.')

      // console.log('if: ', isTemporaryFileOfPuppeteer || isTemporaryFileOfChromium, 'file: ', file)

      if (isTemporaryFileOfPuppeteer || isTemporaryFileOfChromium) {
        fs.rmSync(file, { recursive: true, force: true })
      }
    })

    console.log('arquivos temporários excluídos com sucesso!')
  }
}

export default () => {
  const cleanRoutine = new CronJob.CronJob('10 * * * *', cleanTemporaryFiles)

  cleanRoutine.start()
}