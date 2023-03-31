import { Work } from '@core/models';

export interface Aphorism {
  id: string;
  content: string;
  work: Work;
  image?: string;
}
