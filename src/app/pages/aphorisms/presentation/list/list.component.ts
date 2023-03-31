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
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, CardComponent, IonicModule],
  template: `
    <ion-content *ngIf="{ aphorisms: aphorisms$ | async } as vm">
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
  private readonly scollEvent$: Subject<InfiniteScrollCustomEvent> =
    new Subject<InfiniteScrollCustomEvent>();

  ngOnInit(): void {
    this.pageLoaded$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.scollEvent$),
        filter(([_, event]) => !!event),
        map(([_, event]) => event),
        tap((event) => event!.target.complete())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  protected onScroll(event: InfiniteScrollCustomEvent): void {
    if (!this.canChangePage) return;
    this.scollEvent$.next(event);
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
