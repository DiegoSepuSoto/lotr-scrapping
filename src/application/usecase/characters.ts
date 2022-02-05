import {charactersRepositoryInterface} from '../../domain/repositories/characters';
import {hobbitWikiURL, lotrWikiURL, silmarillionWikiURL, unwantedImage} from '../../utils/constants';
import {Character} from '../../domain/models/Character';
import {charactersFileGenerator} from '../../utils/characters_file_generator';

const lotrCategory = 'Lord of The Rings';
const hobbitCategory = 'The Hobbit';
const silmarillionCategory = 'The Silmarillion';

const isCharacter =
  (character: Character | undefined): character is Character => !!character;

export class charactersUseCase {
  constructor(private charactersRepository: charactersRepositoryInterface) {
  }

  public async generateCharactersFile(): Promise<void> {
    const lotrCharactersLinks = await this.charactersRepository.getCharactersLinksFromPage(lotrWikiURL);
    const hobbitCharactersLinks = await this.charactersRepository.getCharactersLinksFromPage(hobbitWikiURL);
    const silmarillionCharactersLinks = await this.charactersRepository.getCharactersLinksFromPage(silmarillionWikiURL);

    const lotrCharactersArray = await Promise.all(
      lotrCharactersLinks.map(async (characterLink) => {
        return await this.buildCharacterInfo(characterLink, lotrCategory);
      }),
    );

    const hobbitCharactersArray = await Promise.all(
      hobbitCharactersLinks.map(async (characterLink) => {
        return await this.buildCharacterInfo(characterLink, hobbitCategory);
      }),
    );

    const silmarillionCharactersArray = await Promise.all(
      silmarillionCharactersLinks.map(async (characterLink) => {
        return await this.buildCharacterInfo(characterLink, silmarillionCategory);
      }),
    );

    const charactersArray = lotrCharactersArray.concat(hobbitCharactersArray, silmarillionCharactersArray).filter(isCharacter);

    charactersFileGenerator(charactersArray);
  }

  private async buildCharacterInfo(characterLink: string, category: string): Promise<Character | undefined> {
    try {
      const characterInfo = await this.charactersRepository.getCharacterInfo(characterLink);

      if (characterInfo && characterInfo!.image !== unwantedImage)
        return new Character(
          characterLink,
          characterInfo.title,
          characterInfo.image,
          category,
        );
    } catch (e: any) {
      console.error(e.message);
    }
  }
}