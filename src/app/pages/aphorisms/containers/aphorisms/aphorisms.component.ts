import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AphorismsStoreService } from '../../store';
import { provideComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { Aphorism } from '@app/core/models';

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

    <ion-content
      [fullscreen]="true"
      *ngIf="{
        aphorisms: aphorisms$ | async,
        loading: loading$ | async,
        count: count$ | async,
        query: query$ | async,
        page: page$ | async,
        pageSize: pageSize$ | async
      } as vm"
    >
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Aphorisms</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- TODO: search component with queryChange output and query input  -->

      <!-- TODO: cards list with count, page, loading, aphorisms and pageSize inputs and pageChange output  -->
    </ion-content>
  `,
  styles: [],
})
export class AphorismsComponent {
  private readonly store: AphorismsStoreService = inject(AphorismsStoreService);

  protected readonly aphorisms$: Observable<Aphorism[]> = this.store.aphorisms$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly count$: Observable<number> = this.store.count$;
  protected readonly query$: Observable<string | undefined> = this.store.query$;
  protected readonly page$: Observable<number> = this.store.page$;
  protected readonly pageSize$: Observable<number> = this.store.pageSize$;

  onPageChange(page: number): void {
    this.store.getPage(page);
  }

  onQueryChange(query: string): void {
    this.store.search(query);
  }
}
