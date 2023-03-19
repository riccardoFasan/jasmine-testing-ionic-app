import { TestBed } from '@angular/core/testing';

import { AphorismsStoreService } from './aphorisms-store.service';
import { Aphorism, SearchCriteria } from '@app/core/models';
import { first, of } from 'rxjs';
import { ApiService } from '@app/core/services';
import { provideComponentStore } from '@ngrx/component-store';

const MOCK_SEARCH_CRITERIA: SearchCriteria = {
  page: 1,
  pageSize: 10,
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
];

const MOCK_APHORISMS_LIST = {
  count: 1,
  pages: 1,
  currentPage: 1,
  pageSize: 10,
  items: MOCK_APHORISMS,
};

describe('AphorismsStoreService', () => {
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
        provideComponentStore(AphorismsStoreService),
      ],
    });

    service = TestBed.inject(AphorismsStoreService);
    api = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the requested page of aphorisms on store init', () => {
    expect(api.getAphorisms).toHaveBeenCalledWith(MOCK_SEARCH_CRITERIA);

    service.aphorisms$.pipe(first()).subscribe((aphorisms: Aphorism[]) => {
      expect(aphorisms).toBeTruthy();
      expect(aphorisms).toEqual(MOCK_APHORISMS);
    });

    service.loading$.pipe(first()).subscribe((loading: boolean) => {
      expect(loading).toBeDefined();
      expect(loading).toEqual(false);
    });

    service.count$.pipe(first()).subscribe((count: number) => {
      expect(count).toBeDefined();
      expect(count).toEqual(MOCK_APHORISMS_LIST.count);
    });

    service.searchCriteria$
      .pipe(first())
      .subscribe((searchCriteria: SearchCriteria) => {
        expect(searchCriteria).toBeTruthy();
        expect(searchCriteria).toEqual(MOCK_SEARCH_CRITERIA);
      });
  });

  it('should load the requested page of aphorisms on search', () => {
    service.search(MOCK_SEARCH_CRITERIA);

    service.searchCriteria$
      .pipe(first())
      .subscribe((searchCriteria: SearchCriteria) => {
        expect(searchCriteria).toBeTruthy();
        expect(searchCriteria).toEqual(MOCK_SEARCH_CRITERIA);

        expect(api.getAphorisms).toHaveBeenCalledWith(MOCK_SEARCH_CRITERIA);

        service.aphorisms$.pipe(first()).subscribe((aphorisms: Aphorism[]) => {
          expect(aphorisms).toBeTruthy();
          expect(aphorisms).toEqual(MOCK_APHORISMS);
        });

        service.loading$.pipe(first()).subscribe((loading: boolean) => {
          expect(loading).toBeDefined();
          expect(loading).toEqual(false);
        });

        service.count$.pipe(first()).subscribe((count: number) => {
          expect(count).toBeDefined();
          expect(count).toEqual(MOCK_APHORISMS_LIST.count);
        });
      });
  });
});
