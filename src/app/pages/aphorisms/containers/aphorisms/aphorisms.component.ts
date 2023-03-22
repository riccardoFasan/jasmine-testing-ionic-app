import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AphorismsStoreService } from '../../store';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-aphorisms',
  standalone: true,
  imports: [IonicModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(AphorismsStoreService)],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Aphorisms </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Aphorisms</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container"></div>
    </ion-content>
  `,
  styles: [
    `
      #container {
      }
    `,
  ],
})
export class AphorismsComponent {
  private readonly store: AphorismsStoreService = inject(AphorismsStoreService);
}
