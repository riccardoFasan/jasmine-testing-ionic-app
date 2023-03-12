import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import {
  Aphorism,
  Author,
  PaginatedList,
  SearchCriteria,
  Work,
} from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = 'http://localhost:4200/assets/';

  // getAphorisms(
  //   searchCriteria: SearchCriteria
  // ): Observable<PaginatedList<Aphorism>> {
  //   return this.http.get(`${this.baseUrl}/aphorisms.json`);
  // }

  getWork(workId: string): Observable<Work> {
    return this.http.get(`${this.baseUrl}/works.json`).pipe(
      map((response: any) =>
        response.works.find((work: any) => work.id === workId)
      ),
      switchMap((work: any) => {
        return this.getAuthor(work.authorId).pipe(
          map((author: Author) => ({ ...work, author }))
        );
      })
    );
  }

  getAuthor(authorId: string): Observable<Author> {
    return this.http
      .get(`${this.baseUrl}/authors.json`)
      .pipe(
        map((response: any) =>
          response.authors.find((author: any) => author.id === authorId)
        )
      );
  }
}
