import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import {
  MOCK_APHORISM,
  MOCK_AUTHOR,
  MOCK_PAGINATED_LIST,
  MOCK_WORK,
} from 'src/testing/mocks';
import { expectARequest } from 'src/testing/helpers';

function expectAnAuthorRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  expectARequest(
    httpTestingController,
    `${service.baseUrl}/authors.json`,
    'GET',
    {
      authors: [MOCK_AUTHOR],
    }
  );
}

function expectAWorkRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  expectARequest(
    httpTestingController,
    `${service.baseUrl}/works.json`,
    'GET',
    {
      works: [MOCK_WORK],
    }
  );
}

function expectAnAphorismRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  expectARequest(
    httpTestingController,
    `${service.baseUrl}/aphorisms.json`,
    'GET',
    {
      aphorisms: [MOCK_APHORISM],
    }
  );
}

function expectAnUpdateAphorismRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  expectARequest(
    httpTestingController,
    `${service.baseUrl}/aphorisms.json`,
    'PUT',
    {
      aphorisms: [MOCK_APHORISM],
    }
  );
}

describe('ApiService http request methods', () => {
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

  it('should make a GET http call to authors and return an Observable<Author> ', () => {
    service.getAuthor(MOCK_AUTHOR.id).subscribe((author) => {
      expect(author).toEqual(MOCK_AUTHOR);
    });

    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should make a GET http call to authors and works, cross data and return an Observable<Work> ', () => {
    service.getWork(MOCK_WORK.id).subscribe((work) => {
      expect(work).toEqual({ ...MOCK_WORK, author: MOCK_AUTHOR });
    });

    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should make a GET http call to aphorisms, authors and works, cross data and return an Observable<PaginatedList<Aphorism>>', () => {
    service.getAphorisms().subscribe((aphorismList) => {
      expect(aphorismList).toEqual(MOCK_PAGINATED_LIST);
    });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should make a GET http call to aphorisms, authors and works, cross data and return an Observable<Aphorism>', () => {
    service.getAphorism(MOCK_APHORISM.id).subscribe((aphorism) => {
      expect(aphorism).toEqual({
        ...MOCK_APHORISM,
        work: { ...MOCK_WORK, author: MOCK_AUTHOR },
      });
    });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should make a PUT http call to aphorisms and return an Observable<Aphorism> with the same aphorism sent as body', () => {
    service.updateAphorism(MOCK_APHORISM).subscribe((aphorism) => {
      expect(aphorism).toEqual(MOCK_APHORISM);
    });

    expectAnUpdateAphorismRequest(httpTestingController, service);
  });

  it('should find an aphorism searching by its content', () => {
    service
      .getAphorisms({ query: MOCK_APHORISM.content, page: 1, pageSize: 10 })
      .subscribe((aphorismList) => {
        expect(aphorismList.items).toContain({
          ...MOCK_APHORISM,
          work: { ...MOCK_WORK, author: MOCK_AUTHOR },
        });
      });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should find an aphorism searching by its author name', () => {
    service
      .getAphorisms({ query: MOCK_AUTHOR.name, page: 1, pageSize: 10 })
      .subscribe((aphorismList) => {
        expect(aphorismList.items).toContain({
          ...MOCK_APHORISM,
          work: { ...MOCK_WORK, author: MOCK_AUTHOR },
        });
      });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });

  it('should find an aphorism searching by its work title', () => {
    service
      .getAphorisms({ query: MOCK_WORK.title, page: 1, pageSize: 10 })
      .subscribe((aphorismList) => {
        expect(aphorismList.items).toContain({
          ...MOCK_APHORISM,
          work: { ...MOCK_WORK, author: MOCK_AUTHOR },
        });
      });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });
});

describe("ApiService's  PaginatedList<Aphorism>", () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
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

  it('a PaginatedList<Aphorism> should have items length can be less than or equal the requested size', () => {
    service
      .getAphorisms({ page: 1, pageSize: 10 })
      .subscribe((aphorismList) => {
        expect(aphorismList.items.length).toBeLessThanOrEqual(10);
      });

    expectAnAphorismRequest(httpTestingController, service);
    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);
  });
});
