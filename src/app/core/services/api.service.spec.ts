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
  author: MOCK_AUTHOR,
};

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

  // it('should return a list of aphorisms', () => {
  //   expect(service.getAphorisms()).toBeTruthy();
  // })

  it('should return an observable with an Author ', () => {
    service.getAuthor(MOCK_AUTHOR.id).subscribe((response) => {
      expect(response).toEqual(MOCK_AUTHOR);
    });

    const req: TestRequest = httpTestingController.expectOne(
      `${service.baseUrl}/authors.json`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ authors: [MOCK_AUTHOR] });
  });

  it('should return an observable with a Work ', () => {
    service.getWork(MOCK_WORK.id).subscribe((response) => {
      expect(response).toEqual(MOCK_WORK);
    });

    const req: TestRequest = httpTestingController.expectOne(
      `${service.baseUrl}/works.json`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ works: [MOCK_WORK] });
  });
});
