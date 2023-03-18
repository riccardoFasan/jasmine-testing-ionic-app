import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Author, Work } from '../models';

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

function expectAnAuthorRequest(
  httpTestingController: HttpTestingController,
  service: ApiService
): void {
  const authorReq: TestRequest = httpTestingController.expectOne(
    `${service.baseUrl}/authors.json`
  );

  expect(authorReq.request.method).toBe('GET');
  authorReq.flush({ authors: [MOCK_AUTHOR] });
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
  aphorismRequest.flush({ aphorisms: [] });
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
    service.getAuthor(MOCK_AUTHOR.id).subscribe((response) => {
      expect(response).toEqual(MOCK_AUTHOR);
    });

    expectAnAuthorRequest(httpTestingController, service);

  });

  it('should make an http call to authors and works, cross data and return an observable with a Work ', () => {
    service.getWork(MOCK_WORK.id).subscribe((response) => {
      expect(response).toEqual({ ...MOCK_WORK, author: MOCK_AUTHOR });
    });

    expectAWorkRequest(httpTestingController, service);
    expectAnAuthorRequest(httpTestingController, service);


  });


  //   it('should make an http call to aphorisms, authors and works, cross data and return an observable of PaginatedList<Aphorism>', () => {
  //   expect(service.getAphorisms()).toBeTruthy();
  // })
});
