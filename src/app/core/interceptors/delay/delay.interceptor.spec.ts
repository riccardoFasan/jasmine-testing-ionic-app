import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DelayInterceptor } from './delay.interceptor';
import {
  MOCK_LOCALHOST_JSON_ENDPOINT,
  MOCK_LOCALHOST_ENDPOINT,
  MOCK_JSON_ENDPOINT,
} from 'src/testing/mocks';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { expectARequest } from 'src/testing';

describe('DelayInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let http: HttpClient;
  let interceptor: DelayInterceptor;
  let delay: number;
  const NO_DELAY: number = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DelayInterceptor,
        { provide: HTTP_INTERCEPTORS, useClass: DelayInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(DelayInterceptor);
    delay = (interceptor as any).delay;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should delay an http request if its endpoint is a json file on localhost', fakeAsync(() => {
    let hasAResponse: boolean = false;

    http.get(MOCK_LOCALHOST_JSON_ENDPOINT).subscribe((response) => {
      expect(response).toBeTruthy();
      hasAResponse = true;
    });

    expectARequest(httpTestingController, MOCK_LOCALHOST_JSON_ENDPOINT, 'GET');

    tick(NO_DELAY);
    expect(hasAResponse).toBe(false);
    tick(delay);
    expect(hasAResponse).toBe(true);
  }));

  it('should not delay an http request if its endpoint is not a on localhost', fakeAsync(() => {
    let hasAResponse: boolean = false;

    http.get(MOCK_LOCALHOST_ENDPOINT).subscribe((response) => {
      expect(response).toBeTruthy();
      hasAResponse = true;
    });

    expectARequest(httpTestingController, MOCK_LOCALHOST_ENDPOINT, 'GET');
    tick(NO_DELAY);

    expect(hasAResponse).toBe(true);
  }));

  it('should not delay an http request if its endpoint is not a json file', fakeAsync(() => {
    let hasAResponse: boolean = false;

    http.get(MOCK_JSON_ENDPOINT).subscribe((response) => {
      expect(response).toBeTruthy();
      hasAResponse = true;
    });

    expectARequest(httpTestingController, MOCK_JSON_ENDPOINT, 'GET');
    tick(NO_DELAY);

    expect(hasAResponse).toBe(true);
  }));
});
