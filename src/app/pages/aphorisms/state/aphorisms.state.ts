import { Aphorism, SearchCriteria } from '@app/core/models';

export interface AphorismsState {
  aphorisms: Aphorism[];
  loading: boolean;
  count: number;
  pages: number;
  searchCriteria: SearchCriteria;
}

export const INITIAL_APHORISMS_STATE: AphorismsState = {
  aphorisms: [],
  loading: false,
  count: 0,
  pages: 0,
  searchCriteria: {
    page: 1,
    pageSize: 10,
  },
};
