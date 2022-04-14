import {charactersRepositoryInterface} from '../../domain/repositories/characters';
import {hobbitWikiURL, lotrWikiURL, silmarillionWikiURL, silmarillionWikiURL2} from '../../utils/constants';
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
      const hobbitCharactersLinks = await this.charactersRepository.getCharactersLinksFromPages([hobbitWikiURL]);
      const hobbitCharactersArray: Character[] = [];

      for (const hobbitCharacterLink of hobbitCharactersLinks) {
        let characterInfo = await this.buildCharacterInfo(hobbitCharacterLink, hobbitCategory);
        if (characterInfo)
          hobbitCharactersArray.push(characterInfo);
      }

      return hobbitCharactersArray.filter(isCharacter);
    } catch (e) {
      throw(e);
    }
  }

  private async getLotrCharacters(): Promise<Character[]> {
    try {
      const lotrCharactersLinks = await this.charactersRepository.getCharactersLinksFromPages([lotrWikiURL]);
      const lotrCharactersArray: Character[] = [];

      for (const lotrCharacterLink of lotrCharactersLinks) {
        let characterInfo = await this.buildCharacterInfo(lotrCharacterLink, lotrCategory);
        if(characterInfo)
          lotrCharactersArray.push(characterInfo)
      }

      return lotrCharactersArray.filter(isCharacter);
    } catch (e) {
      throw(e);
    }
  }

  private async getSilmCharacters(): Promise<Character[]> {
    try {
      const silmarillionCharactersLinks = await this.charactersRepository.getCharactersLinksFromPages(
        [silmarillionWikiURL, silmarillionWikiURL2]);
      const silmarillionCharactersArray: Character[] = [];

      for (const silmarillionCharacterLink of silmarillionCharactersLinks) {
        let characterInfo = await this.buildCharacterInfo(silmarillionCharacterLink, silmarillionCategory);
        if(characterInfo)
          silmarillionCharactersArray.push(characterInfo);
      }

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

      this.charactersRepository.closeBrowser();

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

      if (characterInfo)
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