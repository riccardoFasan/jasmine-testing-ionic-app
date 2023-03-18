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
      .get(`${this.baseUrl}/authors.json`)
      .pipe(
        map((response: any) =>
          response.authors.find((author: any) => author.id === authorId)
        )
      );
  }

  getWork(workId: string): Observable<Work> {
    return this.http.get(`${this.baseUrl}/works.json`).pipe(
      map((response: any) =>
        response.works.find((work: any) => work.id === workId)
      ),
      switchMap((work: any) => {
        return this.getAuthor(work.author).pipe(
          map((author: Author) => ({ ...work, author }))
        );
      })
    );
  }


  getAphorisms(
    searchCriteria: SearchCriteria = { page: 1, pageSize: 10 }
  ): Observable<PaginatedList<Aphorism>> {
    const currentPage: number = searchCriteria.page;
    const pageSize: number = searchCriteria.pageSize;
    return this.http.get(`${this.baseUrl}/aphorisms.json`).pipe(
      switchMap((response: any) => {
        const aphorisms: Aphorism[] = response.aphorisms.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );
        const works$: Observable<Work>[] = aphorisms.map((aphorism: Aphorism) =>
          this.getWork(aphorism.work as unknown as string)
        );
        return forkJoin(works$).pipe(
          map((works: Work[]) => ({
            pages: Math.ceil(aphorisms.length / pageSize),
            pageSize,
            currentPage,
            items: aphorisms.map((aphorism: Aphorism) => ({
              ...aphorism,
              work: works.find(
                (work: Work) => work.id === (aphorism.work as unknown as string)
              )!,
            })),
            count: aphorisms.length,
          }))
        );
      })
    );
  }



}
