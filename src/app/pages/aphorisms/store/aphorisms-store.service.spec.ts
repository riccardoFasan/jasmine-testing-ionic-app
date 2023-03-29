import { TestBed } from '@angular/core/testing';
import { AphorismsStoreService } from './aphorisms-store.service';
import { Aphorism } from '@app/core/models';
import { first, of } from 'rxjs';
import { ApiService } from '@app/core/services';
import {
  MOCK_APHORISMS,
  MOCK_APHORISMS_LIST,
  MOCK_INITIAL_APHORISMS,
  MOCK_INITIAL_APHORISMS_LIST,
  MOCK_INITIAL_SEARCH_CRITERIA,
  MOCK_SEARCH_CRITERIA,
} from 'src/mocks';

describe('AphorismsStoreService initialization', () => {
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

  it('should have 0 as initial count', () => {
    service.count$.pipe(first()).subscribe((count: number) => {
      expect(count).toBeDefined();
      expect(count).toEqual(0);
    });
  });

  it('should have 0 as initial pages', () => {
    service.pages$.pipe(first()).subscribe((pages: number) => {
      expect(pages).toBeDefined();
      expect(pages).toEqual(0);
    });
  });

  it('should have 1 as initial page', () => {
    service.page$.pipe(first()).subscribe((page: number) => {
      expect(page).toBeTruthy();
      expect(page).toEqual(1);
    });
  });

  it('should have 10 as initial pageSize', () => {
    service.pageSize$.pipe(first()).subscribe((pageSize: number) => {
      expect(pageSize).toBeTruthy();
      expect(pageSize).toEqual(10);
    });
  });

  it('should have undefined as initial query', () => {
    service.query$.pipe(first()).subscribe((query: string | undefined) => {
      expect(query).toBeUndefined();
    });
  });

  it('should load the first page of aphorisms on store init', () => {
    service.ngrxOnStoreInit();

    expect(api.getAphorisms).toHaveBeenCalledWith(MOCK_INITIAL_SEARCH_CRITERIA);

    service.aphorisms$.pipe(first()).subscribe((aphorisms: Aphorism[]) => {
      expect(aphorisms).toBeTruthy();
      expect(aphorisms).toEqual(MOCK_INITIAL_APHORISMS);
    });

    service.page$.pipe(first()).subscribe((page: number) => {
      expect(page).toBeDefined();
      expect(page).toEqual(1);
    });
  });
});

describe('AphorismsStoreService load methods', () => {
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

    service.page$.pipe(first()).subscribe((page: number) => {
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

    service.query$.pipe(first()).subscribe((query?: string) => {
      expect(query).toBeDefined();
      expect(query).toEqual(MOCK_SEARCH_CRITERIA.query);
    });
  });
});
