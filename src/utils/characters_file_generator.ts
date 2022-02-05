import * as fs from 'fs';
import {Character} from '../domain/models/Character';

export const charactersFileGenerator = (characters: Character[]) => {
  fs.writeFileSync('data.json', JSON.stringify({characters}, null, 2));
};