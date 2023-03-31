import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Aphorism } from '@app/core/models';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-card *ngIf="aphorism">
      <ion-img
        *ngIf="aphorism.image"
        [src]="aphorism.image"
        [alt]="aphorism.content"
      ></ion-img>
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
      ion-img {
        height: 20vh;
        object-fit: cover;
      }

      blockquote {
        font-size: 1rem;
        color: rgba(var(--ion-text-color-rgb), 0.9);
        margin: 0 0 0.875rem 0;
      }

      cite {
        font-size: 0.925rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() aphorism?: Aphorism;
}
