import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Aphorism } from '@app/core/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>list works!</p> `,
  styles: [
    `
      cdk-virtual-scroll-viewport {
        height: 100%;
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  @Input() count: number = 0;
  @Input() page: number = 0;
  @Input() pages: number = 0;
  @Input() loading: boolean = false;
  @Input() pageSize: number = 0;

  @Input() set aphorisms(aphorismsPage: Aphorism[]) {}

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  protected readonly aphorisms$: BehaviorSubject<Aphorism[]> =
    new BehaviorSubject<Aphorism[]>([]);

  onScroll(pageIndex: number): void {
    const pageNumber: number = pageIndex + 1;
    if (this.page >= pageNumber || pageNumber > this.pages) return;
    const nextTotalCount: number = this.pageSize * pageNumber;
    const hasCount: boolean = this.count > 0;
    const willLoadNewItems: boolean =
      nextTotalCount > this.aphorisms$.value.length;
    const canChangePage: boolean = hasCount && willLoadNewItems;
    if (!canChangePage) return;
    this.pageChange.emit(this.page + 1);
  }
}
