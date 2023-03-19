import { Aphorism, SearchCriteria } from '@app/core/models';

export interface AphorismsState {
  aphorisms: Aphorism[];
  loading: boolean;
  count: number;
  searchCriteria: SearchCriteria;
}

export const INITIAL_APHORISMS_STATE: AphorismsState = {
  aphorisms: [],
  loading: false,
  count: 0,
  searchCriteria: {
    page: 1,
    pageSize: 10,
  },
};
