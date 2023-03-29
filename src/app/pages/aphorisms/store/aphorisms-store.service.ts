import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { AphorismsState, INITIAL_APHORISMS_STATE } from '../state';
import { Observable, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import { Aphorism, PaginatedList, SearchCriteria } from '@app/core/models';
import { ApiService } from '@app/core/services';

@Injectable()
export class AphorismsStoreService
  extends ComponentStore<AphorismsState>
  implements OnStoreInit
{
  private readonly api: ApiService = inject(ApiService);

  readonly aphorisms$: Observable<Aphorism[]> = this.select(
    (state: AphorismsState) => state.aphorisms
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: AphorismsState) => state.loading
  );

  readonly count$: Observable<number> = this.select(
    (state: AphorismsState) => state.count
  );

  readonly pages$: Observable<number> = this.select(
    (state: AphorismsState) => state.pages
  );

  readonly query$: Observable<string | undefined> = this.select(
    (state: AphorismsState) => state.searchCriteria.query
  );

  readonly page$: Observable<number> = this.select(
    (state: AphorismsState) => state.searchCriteria.page
  );

  readonly pageSize$: Observable<number> = this.select(
    (state: AphorismsState) => state.searchCriteria.pageSize
  );

  private readonly searchCriteria$: Observable<SearchCriteria> = this.select(
    (state: AphorismsState) => state.searchCriteria
  );

  readonly search = this.effect<string>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([query, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, query })
      )
    )
  );

  readonly getPage = this.effect<number>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([page, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, page })
      )
    )
  );

  private readonly loadAphorisms = this.effect(
    (searchCriteria$: Observable<SearchCriteria>) =>
      searchCriteria$.pipe(
        tap(() => this.updateLoading(true)),
        switchMap((searchCriteria: SearchCriteria) =>
          this.api.getAphorisms(searchCriteria)
        ),
        tap((aphorismsList: PaginatedList<Aphorism>) => {
          this.updateAphorisms(aphorismsList.items);
          this.updateCount(aphorismsList.count);
          this.updatePages(aphorismsList.pages);
          this.updateLoading(false);
        })
      )
  );

  private readonly updateAphorisms = this.updater(
    (state: AphorismsState, aphorisms: Aphorism[]): AphorismsState => ({
      ...state,
      aphorisms,
    })
  );

  private readonly updateLoading = this.updater(
    (state: AphorismsState, loading: boolean): AphorismsState => ({
      ...state,
      loading,
    })
  );

  private readonly updateCount = this.updater(
    (state: AphorismsState, count: number): AphorismsState => ({
      ...state,
      count,
    })
  );

  private readonly updatePages = this.updater(
    (state: AphorismsState, pages: number): AphorismsState => ({
      ...state,
      pages,
    })
  );

  private readonly updateSearchCriteria = this.updater(
    (
      state: AphorismsState,
      searchCriteria: SearchCriteria
    ): AphorismsState => ({
      ...state,
      searchCriteria,
    })
  );

  constructor() {
    super(INITIAL_APHORISMS_STATE);
  }

  ngrxOnStoreInit(): void {
    this.loadAphorisms(this.searchCriteria$);
  }
}
