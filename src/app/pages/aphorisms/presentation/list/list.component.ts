import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Aphorism } from '@app/core/models';
import {
  BehaviorSubject,
  Subject,
  filter,
  map,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  InfiniteScrollCustomEvent,
  IonicModule,
  RefresherCustomEvent,
} from '@ionic/angular';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, CardComponent, IonicModule],
  template: `
    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="onRefresh($any($event))">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ng-container *ngIf="{ aphorisms: aphorisms$ | async } as vm">
        <app-card
          *ngFor="let aphorism of vm.aphorisms"
          [aphorism]="aphorism"
        ></app-card>
        <ion-infinite-scroll
          [disabled]="count === vm.aphorisms!.length"
          (ionInfinite)="onScroll($any($event))"
        >
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ng-container>
    </ion-content>
  `,
  styles: [
    `
      ion-spinner {
        text-align: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit, OnDestroy {
  @Input() count: number = 0;
  @Input() page: number = 0;
  @Input() pages: number = 0;
  @Input() pageSize: number = 0;

  @Input() set loading(loading: boolean) {
    if (loading) return;
    this.pageLoaded$.next();
  }

  @Input() set aphorisms(aphorismsPage: Aphorism[]) {
    if (!aphorismsPage) return;
    const aphorisms: Aphorism[] = [
      ...this.aphorisms$.value,
      ...aphorismsPage.filter((aphorism) =>
        this.aphorisms$.value.every(({ id }) => id !== aphorism.id)
      ),
    ];
    this.aphorisms$.next(aphorisms);
  }

  @Input() set query(query: string) {
    if (!query) return;
    this.aphorisms$.next([]);
  }

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  readonly aphorisms$: BehaviorSubject<Aphorism[]> = new BehaviorSubject<
    Aphorism[]
  >([]);

  private readonly pageLoaded$: Subject<void> = new Subject<void>();
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly scrollEvent$: Subject<InfiniteScrollCustomEvent> =
    new Subject<InfiniteScrollCustomEvent>();
  private readonly refreshEvent$: Subject<RefresherCustomEvent> =
    new Subject<RefresherCustomEvent>();

  ngOnInit(): void {
    this.pageLoaded$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.scrollEvent$, this.refreshEvent$),
        map(([_, scrollEvent, refreshEvent]) => [scrollEvent, refreshEvent]),
        tap(([scrollEvent, refreshEvent]) => {
          if (scrollEvent) scrollEvent!.target.complete();
          if (refreshEvent) refreshEvent!.target.complete();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  protected onRefresh(event: RefresherCustomEvent): void {
    this.aphorisms$.next([]);
    this.refreshEvent$.next(event);
    this.pageChange.emit(1);
  }

  protected onScroll(event: InfiniteScrollCustomEvent): void {
    if (!this.canChangePage) return;
    this.scrollEvent$.next(event);
    this.pageChange.emit(this.page + 1);
  }

  private get canChangePage(): boolean {
    const pageNumber: number = this.page + 1;
    const nextTotalCount: number = this.pageSize * pageNumber;
    const willLoadNewItems: boolean =
      nextTotalCount > this.aphorisms$.value.length &&
      nextTotalCount <= this.count;
    return willLoadNewItems;
  }
}
