import * as puppeteer from 'puppeteer';

import {charactersUseCase} from './application/usecase/characters';
import {charactersRepository} from './infrastructure/web/tolkiengateway/characters';
import {Browser} from 'puppeteer';

class lotrScraping {
  public async generateCharactersFile() {
    const browser: Browser = await puppeteer.launch();

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
