import { TestBed, tick } from '@angular/core/testing';
import { DelayInterceptor } from './delay.interceptor';
import {
  MOCK_LOCALHOST_JSON_ENDPOINT,
  MOCK_LOCALHOST_ENDPOINT,
  MOCK_JSON_ENDPOINT,
  MOCK_LOCALHOST_JSON_REQUEST,
  MOCK_LOCALHOST_REQUEST,
  MOCK_JSON_REQUEST,
} from 'src/testing/mocks';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { expectARequest } from 'src/testing';

describe('DelayInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  const DELAY: number = 300;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: DelayInterceptor, multi: true },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should delay an http request if its endpoint is a json file on localhost', () => {
    httpClient.get(MOCK_LOCALHOST_JSON_ENDPOINT).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    expectARequest(httpTestingController, MOCK_LOCALHOST_JSON_ENDPOINT, 'GET');
  });

  it('should not delay an http request if its endpoint is not a json file on localhost', () => {
    httpClient.get(MOCK_LOCALHOST_ENDPOINT).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    expectARequest(httpTestingController, MOCK_LOCALHOST_ENDPOINT, 'GET');

    httpClient.get(MOCK_JSON_ENDPOINT).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    expectARequest(httpTestingController, MOCK_JSON_ENDPOINT, 'GET');
  });
});
