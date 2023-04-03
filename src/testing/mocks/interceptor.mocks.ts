import { HttpRequest } from '@angular/common/http';
import { Aphorism, PaginatedList } from '@app/core/models';

export const MOCK_LOCALHOST_JSON_ENDPOINT: string =
  'http://localhost:4200/assets/aphorisms.json';
export const MOCK_LOCALHOST_JSON_REQUEST: HttpRequest<PaginatedList<Aphorism>> =
  new HttpRequest<PaginatedList<Aphorism>>('GET', MOCK_LOCALHOST_JSON_ENDPOINT);

export const MOCK_LOCALHOST_ENDPOINT: string =
  'http://localhost:4200/assets/aphorisms/';
export const MOCK_LOCALHOST_REQUEST: HttpRequest<PaginatedList<Aphorism>> =
  new HttpRequest<PaginatedList<Aphorism>>('GET', MOCK_LOCALHOST_ENDPOINT);

export const MOCK_JSON_ENDPOINT: string = 'https://json.fake/aphorisms.json';
export const MOCK_JSON_REQUEST: HttpRequest<PaginatedList<Aphorism>> =
  new HttpRequest<PaginatedList<Aphorism>>('GET', MOCK_JSON_ENDPOINT);
