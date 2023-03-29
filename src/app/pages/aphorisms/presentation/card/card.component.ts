import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Aphorism } from '@app/core/models';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card *ngIf="aphorism">
      <ion-card-content>
        <blockquote>
          {{ aphorism.content }}
        </blockquote>
        <cite>
          {{ aphorism.work.title }} -
          {{ aphorism.work.author.name }}
        </cite>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `
      blockquote {
        font-size: 1rem;
        color: rgba(var(--ion-text-color-rgb), 0.9);
        margin: 0 0 1rem 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() aphorism?: Aphorism;
}
