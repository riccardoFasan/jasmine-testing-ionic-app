import { TestBed } from '@angular/core/testing';
import { AphorismsStoreService } from './aphorisms-store.service';
import { Aphorism, SearchCriteria } from '@app/core/models';
import { first, map, of } from 'rxjs';
import { ApiService } from '@app/core/services';

const MOCK_INITIAL_SEARCH_CRITERIA: SearchCriteria = {
  page: 1,
  pageSize: 10,
};

const MOCK_INITIAL_APHORISMS: Aphorism[] = [
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

const MOCK_INITIAL_APHORISMS_LIST = {
  count: 1,
  pages: 1,
  currentPage: 1,
  pageSize: 10,
  items: MOCK_INITIAL_APHORISMS,
};

const MOCK_SEARCH_CRITERIA: SearchCriteria = {
  page: 2,
  pageSize: 2,
  query: 'content',
};

const MOCK_APHORISMS: Aphorism[] = [
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

const MOCK_APHORISMS_LIST = {
  count: 4,
  pages: 2,
  currentPage: 2,
  pageSize: 2,
  items: MOCK_APHORISMS,
};

describe('AphorismsStoreService init', () => {
  let service: AphorismsStoreService;
  let api: ApiService;

  beforeEach(() => {
    const apiServiceSpy: jasmine.SpyObj<ApiService> = jasmine.createSpyObj(
      'ApiService',
      ['getAphorisms']
    );

    apiServiceSpy.getAphorisms.and.returnValues(
      of(MOCK_INITIAL_APHORISMS_LIST)
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        AphorismsStoreService,
      ],
    });

    service = TestBed.inject(AphorismsStoreService);
    api = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have page an empty array of aphorisms as initial state', () => {
    service.aphorisms$.pipe(first()).subscribe((aphorisms: Aphorism[]) => {
      expect(aphorisms).toBeTruthy();
      expect(aphorisms).toEqual([]);
    });
  });

  it('should have loading as false as initial state', () => {
    service.loading$.pipe(first()).subscribe((loading: boolean) => {
      expect(loading).toBeDefined();
      expect(loading).toEqual(false);
    });
  });

  it('should have count as 0 as initial state', () => {
    service.count$.pipe(first()).subscribe((count: number) => {
      expect(count).toBeDefined();
      expect(count).toEqual(0);
    });
  });

  it('should have page 1 and pageSize 10 as initial search criteria', () => {
    service.searchCriteria$
      .pipe(first())
      .subscribe((searchCriteria: SearchCriteria) => {
        expect(searchCriteria).toBeTruthy();
        expect(searchCriteria).toEqual({ page: 1, pageSize: 10 });
      });
  });

  it('should load the first page of aphorisms on store init', () => {
    service.ngrxOnStoreInit();

    expect(api.getAphorisms).toHaveBeenCalledWith(MOCK_INITIAL_SEARCH_CRITERIA);

    service.aphorisms$.pipe(first()).subscribe((aphorisms: Aphorism[]) => {
      expect(aphorisms).toBeTruthy();
      expect(aphorisms).toEqual(MOCK_INITIAL_APHORISMS);
    });

    service.searchCriteria$
      .pipe(
        first(),
        map((searchCriteria: SearchCriteria) => searchCriteria.page)
      )
      .subscribe((page: number) => {
        expect(page).toBeDefined();
        expect(page).toEqual(1);
      });
  });
});

describe('AphorismsStoreService search', () => {
  let service: AphorismsStoreService;
  let api: ApiService;

  beforeEach(() => {
    const apiServiceSpy: jasmine.SpyObj<ApiService> = jasmine.createSpyObj(
      'ApiService',
      ['getAphorisms']
    );

    apiServiceSpy.getAphorisms.and.returnValue(of(MOCK_APHORISMS_LIST));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        AphorismsStoreService,
      ],
    });

    service = TestBed.inject(AphorismsStoreService);
    api = TestBed.inject(ApiService);
  });

  it('should load the requested page of aphorisms on page changed', () => {
    service.patchState({
      searchCriteria: MOCK_SEARCH_CRITERIA,
    });

    service.getPage(MOCK_SEARCH_CRITERIA.page);

    service.ngrxOnStoreInit();

    expect(api.getAphorisms).toHaveBeenCalledWith(MOCK_SEARCH_CRITERIA);

    service.aphorisms$.pipe(first()).subscribe((aphorisms: Aphorism[]) => {
      expect(aphorisms).toBeTruthy();
      expect(aphorisms).toEqual(MOCK_APHORISMS);
    });

    service.searchCriteria$
      .pipe(
        first(),
        map((searchCriteria: SearchCriteria) => searchCriteria.page)
      )
      .subscribe((page: number) => {
        expect(page).toBeDefined();
        expect(page).toEqual(MOCK_SEARCH_CRITERIA.page);
      });
  });

  it('should load a page of aphorisms on query changed', () => {
    service.patchState({
      searchCriteria: MOCK_SEARCH_CRITERIA,
    });

    service.search(MOCK_SEARCH_CRITERIA.query!);

    service.ngrxOnStoreInit();

    expect(api.getAphorisms).toHaveBeenCalledWith(MOCK_SEARCH_CRITERIA);

    service.aphorisms$.pipe(first()).subscribe((aphorisms: Aphorism[]) => {
      expect(aphorisms).toBeTruthy();
      expect(aphorisms).toEqual(MOCK_APHORISMS);
    });

    service.searchCriteria$
      .pipe(
        first(),
        map((searchCriteria: SearchCriteria) => searchCriteria.query)
      )
      .subscribe((page?: string) => {
        expect(page).toBeDefined();
        expect(page).toEqual(MOCK_SEARCH_CRITERIA.query);
      });
  });
});
