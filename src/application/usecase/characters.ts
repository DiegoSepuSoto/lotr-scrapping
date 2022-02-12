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

  private async getHobbCharacters(): Promise<Character[]> {
    try {
      const hobbitCharactersLinks = await this.charactersRepository.getCharactersLinksFromPage(hobbitWikiURL);

      const hobbitCharactersArray = await Promise.all(
        hobbitCharactersLinks.map(async (characterLink) => {
          return await this.buildCharacterInfo(characterLink, hobbitCategory);
        }),
      );

      return hobbitCharactersArray.filter(isCharacter);
    } catch (e) {
      throw(e);
    }
  }

  private async getLotrCharacters(): Promise<Character[]> {
    try {
      const lotrCharactersLinks = await this.charactersRepository.getCharactersLinksFromPage(lotrWikiURL);

      const lotrCharactersArray = await Promise.all(
        lotrCharactersLinks.map(async (characterLink) => {
          return await this.buildCharacterInfo(characterLink, lotrCategory);
        }),
      );

      return lotrCharactersArray.filter(isCharacter);
    } catch (e) {
      throw(e);
    }
  }

  private async getSilmCharacters(): Promise<Character[]> {
    try {
      const silmarillionCharactersLinks = await this.charactersRepository.getCharactersLinksFromPage(silmarillionWikiURL);

      const silmarillionCharactersArray = await Promise.all(
        silmarillionCharactersLinks.map(async (characterLink) => {
          return await this.buildCharacterInfo(characterLink, silmarillionCategory);
        }),
      );

      return silmarillionCharactersArray.filter(isCharacter);
    } catch (e) {
      throw(e);
    }
  }

  public async generateCharactersFile(): Promise<void> {
    try {
      const promisesCharacters = [];
      const characters: Character[] = [];

      const hobbCharacters = await this.getHobbCharacters();
      const lotrCharacters = await this.getLotrCharacters();
      const silmCharacters = await this.getSilmCharacters();
      promisesCharacters.push(hobbCharacters, lotrCharacters, silmCharacters);

      for (const charactersArray of promisesCharacters) {
        characters.push(...charactersArray);
      }

      charactersFileGenerator(characters);
    } catch (e) {
      throw(e);
    }
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
    } catch (e) {
      throw(e);
    }
  }
}