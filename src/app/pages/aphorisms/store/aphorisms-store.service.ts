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
    (state) => state.aphorisms
  );
  readonly loading$: Observable<boolean> = this.select(
    (state) => state.loading
  );
  readonly count$: Observable<number> = this.select((state) => state.count);
  readonly searchCriteria$: Observable<SearchCriteria> = this.select(
    (state) => state.searchCriteria
  );

  readonly search = this.effect<SearchCriteria>(
    pipe(tap((searchCriteria) => this.updateSearchCriteria(searchCriteria)))
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
