import { Request, Response } from 'express'
import puppeteer from 'puppeteer'
import fs from 'fs'

interface CPFLDataInterface {
  date: string,
  hour: string,
  contents: Array<{
    bairro: string,
    ruas: Array<string>
  }>
}

export default class CPFLController {
  private getStateNumber = (state: string) => {
    if (state === 'sp') {
      return 4
    }
  }

  private makeURL = (stateNumber: number) => {
    const url = `https://spir.cpfl.com.br/Publico/ConsultaDesligamentoProgramado/Visualizar/${stateNumber}`

    return url
  }

  private runBrowser = async () => {
    const minimal_args = [
      '--incognito',
  
      '--autoplay-policy=user-gesture-required',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-domain-reliability',
      '--disable-extensions',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-ipc-flooding-protection',
      '--disable-notifications',
      '--disable-offer-store-unmasked-wallet-cards',
      '--disable-popup-blocking',
      '--disable-print-preview',
      '--disable-prompt-on-repost',
      '--disable-renderer-backgrounding',
      '--disable-setuid-sandbox',
      '--disable-speech-api',
      '--disable-sync',
      '--hide-scrollbars',
      '--ignore-gpu-blacklist',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-first-run',
      '--no-pings',
      '--no-sandbox',
      '--no-zygote',
      '--password-store=basic',
      '--use-gl=swiftshader',
      '--use-mock-keychain',
    ]
  
    const browser = await puppeteer.launch({ 
      headless: false, 
      args: minimal_args,
      // userDataDir: false
    })
    
    return browser
  }

  private closeBrowser = async (browser: puppeteer.Browser) => {
    let chromeTmpDataDir: string = ''

    let chromeSpawnArgs = browser.process()?.spawnargs

    if (!!chromeSpawnArgs) {
      for (let i = 0; i < chromeSpawnArgs.length; i++) {
        if (chromeSpawnArgs[i].indexOf("--user-data-dir=") === 0) {
            chromeTmpDataDir = chromeSpawnArgs[i].replace("--user-data-dir=", "");
        }
      }
    }

    await browser.close()

    fs.rmSync(chromeTmpDataDir, { recursive: true, force: true })
  }

  private sleep = (seconds: number) => {
    return new Promise(resolve => setTimeout(resolve, 1000 * seconds))
  }

  private newPage = async (browser: puppeteer.Browser) => {
    const page = await browser.newPage()

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
    await page.setDefaultNavigationTimeout(0)

    return page
  }

  private selectToCity = async (page: puppeteer.Page) => {
    await page.evaluate(() => {
      document.getElementById('card-tipo-consulta-localizacao')?.click()
    })

    await this.sleep(3)
  }

  private searchWithCity = async (page: puppeteer.Page) => {
    await page.evaluate((a: number) => {
      let select = document.getElementById('IdMunicipio')
      if (!!select) {
        select['value'] = '287'
      }

      let btn = document.getElementById('btn-pesquisar')
      if (!!btn) {
        btn.click()
      }
    })

    await this.sleep(5)
  }

  private getData = async (page: puppeteer.Page) => {
    // let r: CPFLDataInterface = []

    let result: Array<CPFLDataInterface> = await page.evaluate(() => {
      let r = [{}]
      let classes = document.getElementsByClassName('consulta__listagem__resultados__timeline')

      const results = classes[0].children
      const date = results[1].children[1].textContent

      const groupsData = results[2]

      const firstContent = results[2].children
      return Object.keys(firstContent).map((content, index) => {
        const hour = firstContent[index].getElementsByClassName('consulta__listagem__resultados__timeline__item__content__accordion__horario')[0].textContent
        let districtsContents = ['']
        let streetsContents = ['']
        let contents = [{
          bairro: 'exemplo',
          ruas: ['']
        }]
        
        let data = {
          bairro: '',
          ruas: ['']
        }
        
        const districts = firstContent[index].getElementsByClassName('consulta__listagem__resultados__timeline__item__content__accordion__content__item')
        Object.keys(districts).forEach((district, index) => {
          const content = districts[index].getElementsByClassName('consulta__listagem__resultados__timeline__item__content__accordion__content__bairro__descricao')[0]
          const districtContent = content.children[1].textContent
          
          districtsContents.push(String(districtContent))
          data['bairro'] = String(districtContent)

          const streets = districts[index].getElementsByClassName('consulta__listagem__resultados__timeline__item__content__accordion__content__bairro__content')[0].children
          Object.keys(streets).forEach((street, index) => {
            const streetContent = streets[index].children[1].textContent

            streetsContents.push(String(streetContent))
          })

          data['ruas'] = streetsContents.slice(1, streetsContents.length)
        })

        contents.push(data)
        data = {
          bairro: '',
          ruas: ['']
        }

        return {
          date: String(date),
          hour: String(hour),
          contents: contents.slice(1, contents.length)
        }
      })
    })
    
    result.forEach(r => {
      console.log(r['contents'])
    })
    return result
  }

  public getCPFL = async (req: Request, res: Response) => {
    const url = this.makeURL(Number(this.getStateNumber('sp')))

    const browser = await this.runBrowser()
    const page = await this.newPage(browser)

    await page.goto(url, { waitUntil: 'load' })
    
    await this.selectToCity(page)
    await this.searchWithCity(page)
    const result = await this.getData(page)

    console.log(result)

    return res.status(200).json({})

    // this.closeBrowser(browser)
  }
}