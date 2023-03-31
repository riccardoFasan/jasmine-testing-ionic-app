import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, filter, map, takeUntil, tap, withLatestFrom } from 'rxjs';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-refresher',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-refresher slot="fixed" (ionRefresh)="onRefresh($any($event))">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefresherComponent implements OnInit {
  @Input() set loading(loading: boolean) {
    if (loading) return;
    this.pageLoaded$.next();
  }

  @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

  private readonly pageLoaded$: Subject<void> = new Subject<void>();
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly refreshEvent$: Subject<RefresherCustomEvent> =
    new Subject<RefresherCustomEvent>();

  ngOnInit(): void {
    this.pageLoaded$
      .pipe(
        takeUntil(this.destroy$),
        withLatestFrom(this.refreshEvent$),
        filter(([_, event]) => !!event),
        map(([_, event]) => event),
        tap((event) => event!.target.complete())
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  protected onRefresh(event: RefresherCustomEvent): void {
    this.refreshEvent$.next(event);
    this.refresh.emit();
  }
}
