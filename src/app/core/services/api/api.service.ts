import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap, timer } from 'rxjs';
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

  getAphorism(aphorismId: string): Observable<Aphorism> {
    return this.http
      .get<{ aphorisms: Aphorism[] }>(`${this.baseUrl}/aphorisms.json`)
      .pipe(
        map((response: any) =>
          response.aphorisms.find(
            (aphorism: Aphorism) => aphorism.id === aphorismId
          )
        ),
        switchMap((aphorism: Aphorism) =>
          this.getWork(aphorism.work as unknown as string).pipe(
            map((work: Work) => ({ ...aphorism, work }))
          )
        )
      );
  }

  updateAphorism(aphorism: Aphorism): Observable<Aphorism> {
    return this.http
      .put<Aphorism>(`${this.baseUrl}/aphorisms.json`, aphorism)
      .pipe(map(() => aphorism));
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

        const matchQuery = (aphorism: Aphorism): boolean => {
          if (!searchCriteria.query) return true;
          const query: string = searchCriteria.query.toLowerCase();

          const content: string = aphorism.content.toLowerCase();
          if (content.includes(query)) return true;

          const workTitle: string = aphorism.work.title.toLowerCase();
          if (workTitle.toLowerCase().includes(query)) return true;

          const authorName: string = aphorism.work.author.name.toLowerCase();
          if (authorName.toLowerCase().includes(query)) return true;

          return false;
        };

        const aphorisms: Aphorism[] = aphorismsResponse.aphorisms.reduce(
          (aphorisms: Aphorism[], aphorism: Aphorism) => {
            aphorism = {
              ...aphorism,
              work: getWork(aphorism.work as unknown as string),
            };

            if (!matchQuery(aphorism)) return aphorisms;
            return [...aphorisms, aphorism];
          },
          []
        );

        return {
          count: aphorisms.length,
          pages: Math.ceil(aphorisms.length / pageSize),
          currentPage,
          pageSize,
          items: aphorisms.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          ),
        };
      })
    );
  }
}
