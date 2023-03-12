import { Author } from '@core/models';

export interface Work {
  id: string;
  title: string;
  year: number;
  author: Author;
}
