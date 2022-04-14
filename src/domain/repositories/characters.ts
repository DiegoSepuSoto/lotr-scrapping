import {Character} from '../models/Character';

export interface charactersRepositoryInterface {
  getCharactersLinksFromPages(pageURL: string[]) : Promise<string[]>
  getCharacterInfo(characterLink: string): Promise<Character | null>
  closeBrowser(): void;
}