import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';

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

  // it('should return an author ', fakeAsync(() => {
  // const authorId: string = '1';
  // expect(service.getAuthor(authorId)).toBeTruthy();
  // }));

  // it('should return a work ', () => {
  //   const workId: string = '1';
  //   expect(service.getWork(workId)).toBeTruthy();
  // });
});
