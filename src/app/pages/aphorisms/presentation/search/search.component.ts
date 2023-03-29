import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-searchbar
      show-clear-button="focus"
      placeholder="Search aphorisms"
      [value]="query"
      (ionChange)="search($event)"
    ></ion-searchbar>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  @Input() query: string = '';

  @Output() queryChange: EventEmitter<string> = new EventEmitter<string>();

  protected search(event: Event): void {
    const query: string = (event as unknown as CustomEvent).detail.value;
    if (!query) return;
    this.queryChange.emit(query);
  }
}
