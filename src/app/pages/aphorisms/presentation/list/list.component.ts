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
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
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
      </ion-refresher>
      <ng-container *ngIf="{ aphorisms: aphorisms$ | async } as vm">
        <ion-spinner
          *ngIf="loading && vm.aphorisms!.length === 0"
          name="crescent"
        ></ion-spinner>
        <app-card
          *ngFor="let aphorism of vm.aphorisms"
          [aphorism]="aphorism"
        ></app-card>
        <ion-infinite-scroll
          [disabled]="count === vm.aphorisms!.length"
          (ionInfinite)="onScroll($any($event))"
        >
          <ion-infinite-scroll-content
            loadingSpinner="crescent"
          ></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ng-container>
    </ion-content>
  `,
  styles: [
    `
      ion-spinner {
        width: 100%;
        text-align: center;
        margin: 60px 0 0.25rem 0; // 60px same as ion-refresher height
      }

      ion-refresher.refresher-active + ion-spinner {
        margin-top: 0;
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
  @Input() loading: boolean = false;

  @Input() set aphorisms(aphorismsPage: Aphorism[]) {
    if (!aphorismsPage) return;
    const aphorisms: Aphorism[] = [
      ...this.aphorisms$.value,
      ...aphorismsPage.filter((aphorism) =>
        this.aphorisms$.value.every(({ id }) => id !== aphorism.id)
      ),
    ];
    this.aphorisms$.next(aphorisms);
    this.pageLoaded$.next();
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

  private scrollEvent: InfiniteScrollCustomEvent | null = null;
  private refreshEvent: RefresherCustomEvent | null = null;

  ngOnInit(): void {
    this.pageLoaded$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          if (this.refreshEvent) {
            this.refreshEvent.target.complete();
            this.refreshEvent = null;
          }
          if (this.scrollEvent) {
            this.scrollEvent.target.complete();
            this.scrollEvent = null;
          }
        })
      )

      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  protected onRefresh(event: RefresherCustomEvent): void {
    this.aphorisms$.next([]);
    this.refreshEvent = event;
    this.pageChange.emit(1);
  }

  protected onScroll(event: InfiniteScrollCustomEvent): void {
    if (!this.canChangePage) return;
    this.scrollEvent = event;
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
