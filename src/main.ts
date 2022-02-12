const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

import {charactersUseCase} from './application/usecase/characters';
import {charactersRepository} from './infrastructure/web/tolkiengateway/characters';

class lotrScraping {
  public async generateCharactersFile() {
    const browser = await puppeteer.use(StealthPlugin()).launch({headless: false});

    const charactersRepositoryImpl = new charactersRepository(browser);
    const charactersUseCaseImpl = new charactersUseCase(charactersRepositoryImpl);

    await charactersUseCaseImpl.generateCharactersFile();
  }
}

const lotrScrapingImpl = new lotrScraping();

lotrScrapingImpl.generateCharactersFile().then(() => {
  console.log('done!');
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
