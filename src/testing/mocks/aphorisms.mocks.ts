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
export const APHORISM_WITH_IMAGE: Aphorism = {
  id: '1',
  content: 'Test aphorism content',
  image:
    'https://images.unsplash.com/photo-1462747772350-460bb4aad7f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
  work: {
    id: '1',
    year: 2000,
    title: 'Test work title',
    author: {
      id: '1',
      name: 'Test author name',
    },
  },
};

export const APHORISM_WITH_NO_IMAGE: Aphorism = {
  id: '1',
  content: 'Test aphorism content',
  work: {
    id: '1',
    year: 2000,
    title: 'Test work title',
    author: {
      id: '1',
      name: 'Test author name',
    },
  },
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
