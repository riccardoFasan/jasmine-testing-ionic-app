import {
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { MOCK_LOCALHOST_JSON_ENDPOINT } from '../mocks';

export function expectARequest(
  httpTestingController: HttpTestingController,
  url: string,
  method: string,
  mockResponse: any = {}
): void {
  const request: TestRequest = httpTestingController.expectOne(url);
  expect(request.request.method).toBe(method);
  request.flush(mockResponse);
}
