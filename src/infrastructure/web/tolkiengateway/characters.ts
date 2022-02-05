import {Browser} from 'puppeteer';

import {charactersRepositoryInterface} from '../../../domain/repositories/characters';
import {Character} from '../../../domain/models/Character';

export class charactersRepository implements charactersRepositoryInterface {
  constructor(private browser: Browser) {
  }

  public async getCharactersLinksFromPage(pageURL: string): Promise<string[]> {
    try {
      const page = await this.browser.newPage();

      await page.goto(pageURL, {
        timeout: 0,
        waitUntil: 'load',
      });

      return await page.evaluate(() => {
        const items = document.querySelectorAll('li');

        let links: string[] = [];

        items.forEach((itemElement) => {
          if (itemElement.id === '') {
            const firstChild = itemElement.firstChild;
            if (firstChild && firstChild instanceof HTMLAnchorElement) {
              links.push(firstChild.href);
            }
          }
        });

        return links;
      });
    } catch (e: any) {
      console.error(e.message);
      return [];
    }
  }

  public async getCharacterInfo(characterLink: string): Promise<Character | undefined> {
    try {
      const page = await this.browser.newPage();

      await page.goto(characterLink, {
        timeout: 0,
        waitUntil: 'load',
      });

      const characterObject = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        const headingTitle = document.querySelector('#firstHeading');

        console.log(headingTitle);

        if (images.length > 1 && headingTitle && headingTitle instanceof HTMLElement) {
          const image = images[1];
          const link = image.src;
          const title = headingTitle.innerText;

          return {
            link, title,
          };
        }

        return undefined;
      });

      if (characterObject) {
        return new Character('', characterObject.title, characterObject.link, '');
      }

      return undefined;

    } catch (e: any) {
      console.error(e.message);
      throw(e);
    }
  }
}