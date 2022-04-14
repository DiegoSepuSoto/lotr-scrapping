import {charactersRepositoryInterface} from '../../../domain/repositories/characters';
import {Character} from '../../../domain/models/Character';

export class charactersRepository implements charactersRepositoryInterface {
  constructor(private browser: any) {
  }

  public async getCharactersLinksFromPages(pageURLs: string[]): Promise<string[]> {
    try {
      let charactersLinks: string[] = [];

      await Promise.all(
        pageURLs.map(async (pageURL: string) => {
          const page = await this.browser.newPage();
          await page.goto(pageURL, {waitUntil: 'load', timeout: 0});

          charactersLinks.unshift(await page.evaluate(() => {
            let charactersLinks: string[] = [];

            const pageMemberItemHasImage = (pageMemberItemChildren: HTMLCollection): boolean => {
              const pageMemberLeft = pageMemberItemChildren[0].innerHTML.replace(/(\r\n|\n|\r|\t)/gm, '');
              return pageMemberLeft !== '' && !pageMemberLeft.includes("svg");
            };

            const getCharacterLink = (pageMemberItemChildren: HTMLCollection) => {
              return `https://lotr.fandom.com${pageMemberItemChildren[1].getAttribute('href')}`;
            };

            const pageMemberItems = document.querySelectorAll('.category-page__member');

            pageMemberItems.forEach((pageMemberItem) => {
              const pageMemberItemChildren = pageMemberItem.children;

              if (pageMemberItemChildren.length == 2 && pageMemberItemHasImage(pageMemberItemChildren)) {
                charactersLinks.push(getCharacterLink(pageMemberItemChildren));
              }
            });

            return charactersLinks;
          }));

          await page.close();
        }),
      );

      return charactersLinks.flat();
    } catch (e) {
      throw(e);
    }
  }

  public async getCharacterInfo(characterLink: string): Promise<Character | null> {
    try {
      const page = await this.browser.newPage();

      await page.goto(characterLink, {waitUntil: 'load', timeout: 0});

      const characterObject = await page.evaluate(() => {
        const image = document.querySelectorAll('.pi-image-thumbnail')[0];
        const headingTitle = document.querySelector('#firstHeading');

        if (image && headingTitle) {
          const link = image.getAttribute('src');
          const title = (headingTitle as HTMLElement)!.innerText;

          return {
            link, title,
          };
        } else return null;
      });

      await page.close();

      if (characterObject) {
        return new Character('', characterObject.title, characterObject.link, '');
      } else {
        return null;
      }
    } catch (e: any) {
      throw(e);
    }
  }

  public async closeBrowser(): Promise<void> {
    await this.browser.close();
  }
}