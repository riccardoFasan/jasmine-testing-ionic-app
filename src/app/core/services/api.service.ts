import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
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
  readonly baseUrl: string = 'http://localhost:4200/assets';

  getAuthor(authorId: string): Observable<Author> {
    return this.http
      .get<{ authors: Author[] }>(`${this.baseUrl}/authors.json`)
      .pipe(
        map((response: any) =>
          response.authors.find((author: Author) => author.id === authorId)
        )
      );
  }

  getWork(workId: string): Observable<Work> {
    return this.http.get<{ works: Work[] }>(`${this.baseUrl}/works.json`).pipe(
      map((response: any) =>
        response.works.find((work: Work) => work.id === workId)
      ),
      switchMap((work: Work) =>
        this.getAuthor(work.author as unknown as string).pipe(
          map((author: Author) => ({ ...work, author }))
        )
      )
    );
  }

  getAphorisms(
    searchCriteria: SearchCriteria = { page: 1, pageSize: 10 }
  ): Observable<PaginatedList<Aphorism>> {
    const currentPage: number = searchCriteria.page;
    const pageSize: number = searchCriteria.pageSize;
    return forkJoin([
      this.http.get<{ aphorisms: Aphorism[] }>(
        `${this.baseUrl}/aphorisms.json`
      ),
      this.http.get<{ works: Work[] }>(`${this.baseUrl}/works.json`),
      this.http.get<{ authors: Author[] }>(`${this.baseUrl}/authors.json`),
    ]).pipe(
      map(([aphorismsResponse, worksResponse, authorsResponse]) => {
        const aphorisms: Aphorism[] = aphorismsResponse.aphorisms;
        const works: Work[] = worksResponse.works;
        const authors: Author[] = authorsResponse.authors;

        const getWork = (workId: string): Work => {
          const work: Work = works.find((work: Work) => work.id === workId)!;
          return {
            ...work,
            author: getAuthor(work.author as unknown as string),
          };
        };

        const getAuthor = (authorId: string): Author =>
          authors.find((author: Author) => author.id === authorId)!;

        return {
          count: aphorisms.length,
          pages: Math.ceil(aphorisms.length / pageSize),
          currentPage,
          pageSize,
          items: aphorisms.map((aphorism: Aphorism) => ({
            ...aphorism,
            work: getWork(aphorism.work as unknown as string),
          })),
        };
      })
    );
  }
}
