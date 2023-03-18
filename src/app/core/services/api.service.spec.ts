import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Aphorism, Author, Work, PaginatedList } from '../models';

const MOCK_AUTHOR: Author = {
  id: '1',
  name: 'John Doe',
};

const MOCK_WORK: Work = {
  id: '1',
  title: 'The Work',
  year: 2020,
  author: '1' as unknown as Author,
};

const MOCK_APHORISM: Aphorism = {
  id: '1',
  content: 'The Aphorism',
  work: '1' as unknown as Work,
};

const MOCK_PAGINATED_LIST: PaginatedList<Aphorism> = {
  count: 1,
  pages: 1,
  currentPage: 1,
  pageSize: 10,
  items: [{ ...MOCK_APHORISM, work: { ...MOCK_WORK, author: MOCK_AUTHOR } }],
};

function expectAnAuthorRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  const authorRequest: TestRequest = httpTestingController.expectOne(
    `${service.baseUrl}/authors.json`
  );

  expect(authorRequest.request.method).toBe('GET');
  authorRequest.flush({ authors: [MOCK_AUTHOR] });
}

function expectAWorkRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  const workRequest: TestRequest = httpTestingController.expectOne(
    `${service.baseUrl}/works.json`
  );

  expect(workRequest.request.method).toBe('GET');
  workRequest.flush({ works: [MOCK_WORK] });
}

function expectAnAphorismRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  const aphorismRequest: TestRequest = httpTestingController.expectOne(
    `${service.baseUrl}/aphorisms.json`
  );

  expect(aphorismRequest.request.method).toBe('GET');
  aphorismRequest.flush({ aphorisms: [MOCK_APHORISM] });
}

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make an http call to authors and return an observable with an Author ', () => {
    service.getAuthor(MOCK_AUTHOR.id).subscribe((author) => {
      expect(author).toEqual(MOCK_AUTHOR);
    });

    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should make an http call to authors and works, cross data and return an observable with a Work ', () => {
    service.getWork(MOCK_WORK.id).subscribe((work) => {
      expect(work).toEqual({ ...MOCK_WORK, author: MOCK_AUTHOR });
    });

    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should make an http call to aphorisms, authors and works, cross data and return an observable of PaginatedList<Aphorism>', () => {
    service.getAphorisms().subscribe((aphorismList) => {
      expect(aphorismList).toEqual(MOCK_PAGINATED_LIST);
    });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('a PaginatedList<Aphorism> should have count equals to the aphorisms length', () => {
    service.getAphorisms().subscribe((aphorismList) => {
      expect(aphorismList.count).toEqual(MOCK_PAGINATED_LIST.items.length);
    });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('a PaginatedList<Aphorism> should have pages equals to the ratio between the aphorsisms length and the requested pageSize', () => {
    service.getAphorisms().subscribe((aphorismList) => {
      expect(aphorismList.pages).toEqual(
        Math.ceil(MOCK_PAGINATED_LIST.items.length / aphorismList.pageSize)
      );
    });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('a PaginatedList<Aphorism> should have currentPage equals to the requested page', () => {
    service
      .getAphorisms({ page: 2, pageSize: 10 })
      .subscribe((aphorismList) => {
        expect(aphorismList.currentPage).toEqual(2);
      });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('a PaginatedList<Aphorism> should have pageSize equals to the requested size', () => {
    service
      .getAphorisms({ page: 1, pageSize: 10 })
      .subscribe((aphorismList) => {
        expect(aphorismList.pageSize).toEqual(10);
      });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });
});
