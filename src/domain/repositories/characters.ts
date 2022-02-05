import {Character} from '../models/Character';

export interface charactersRepositoryInterface {
  getCharactersLinksFromPage(pageURL: string) : Promise<string[]>
  getCharacterInfo(characterLink: string): Promise<Character | undefined>
}