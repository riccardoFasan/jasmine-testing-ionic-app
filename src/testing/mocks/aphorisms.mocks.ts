import {
  Aphorism,
  Author,
  PaginatedList,
  SearchCriteria,
  Work,
} from '@app/core/models';

export const MOCK_INITIAL_SEARCH_CRITERIA: SearchCriteria = {
  page: 1,
  pageSize: 10,
};

export const MOCK_INITIAL_APHORISMS: Aphorism[] = [
  {
    id: '1',
    content: 'content 1',
    work: {
      id: '1',
      title: 'title 1',
      year: 2000,
      author: {
        id: '1',
        name: 'name 1',
      },
    },
  },
];

export const MOCK_INITIAL_APHORISMS_LIST = {
  count: 1,
  pages: 1,
  currentPage: 1,
  pageSize: 10,
  items: MOCK_INITIAL_APHORISMS,
};

export const MOCK_SEARCH_CRITERIA: SearchCriteria = {
  page: 2,
  pageSize: 2,
  query: 'content',
};

export const MOCK_APHORISMS: Aphorism[] = [
  {
    id: '1',
    content: 'content 1',
    work: {
      id: '1',
      title: 'title 1',
      year: 2000,
      author: {
        id: '1',
        name: 'name 1',
      },
    },
  },
  {
    id: '1',
    content: 'content 1',
    work: {
      id: '1',
      title: 'title 1',
      year: 2000,
      author: {
        id: '1',
        name: 'name 1',
      },
    },
  },
];

export const MOCK_APHORISMS_LIST = {
  count: 4,
  pages: 2,
  currentPage: 2,
  pageSize: 2,
  items: MOCK_APHORISMS,
};

export const MOCK_PAGE: number = 2;
export const MOCK_QUERY: string = 'content';

export const MOCK_AUTHOR: Author = {
  id: '1',
  name: 'John Doe',
};

export const MOCK_WORK: Work = {
  id: '1',
  title: 'The Work',
  year: 2020,
  author: '1' as unknown as Author,
};

export const MOCK_APHORISM: Aphorism = {
  id: '1',
  content: 'The Aphorism',
  work: '1' as unknown as Work,
};

export const MOCK_PAGINATED_LIST: PaginatedList<Aphorism> = {
  count: 1,
  pages: 1,
  currentPage: 1,
  pageSize: 10,
  items: [{ ...MOCK_APHORISM, work: { ...MOCK_WORK, author: MOCK_AUTHOR } }],
};
