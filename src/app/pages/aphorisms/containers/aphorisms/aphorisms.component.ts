import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AphorismsStoreService } from '../../store';
import { provideComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { Aphorism } from '@app/core/models';
import { ListComponent, SearchComponent } from '../../presentation';

@Component({
  selector: 'app-aphorisms',
  standalone: true,
  imports: [IonicModule, CommonModule, SearchComponent, ListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(AphorismsStoreService)],
  template: `
    <ng-container
      *ngIf="{
        aphorisms: aphorisms$ | async,
        loading: loading$ | async,
        count: count$ | async,
        pages: pages$ | async,
        query: query$ | async,
        page: page$ | async,
        pageSize: pageSize$ | async
      } as vm"
    >
      <ion-header [translucent]="true">
        <ion-toolbar>
          <ion-title> Aphorisms </ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <app-search
            [query]="vm.query!"
            (queryChange)="onQueryChange($event)"
          ></app-search>
        </ion-toolbar>
      </ion-header>

      <ion-content [fullscreen]="true">
        <app-list
          [aphorisms]="vm.aphorisms!"
          [count]="vm.count!"
          [page]="vm.page!"
          [pages]="vm.pages!"
          [loading]="!!vm.loading"
          [pageSize]="vm.pageSize!"
          [query]="vm.query!"
          (pageChange)="onPageChange($event)"
        ></app-list>
      </ion-content>
    </ng-container>
  `,
  styles: [],
})
export class AphorismsComponent {
  private readonly store: AphorismsStoreService = inject(AphorismsStoreService);

  protected readonly aphorisms$: Observable<Aphorism[]> = this.store.aphorisms$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly count$: Observable<number> = this.store.count$;
  protected readonly pages$: Observable<number> = this.store.pages$;
  protected readonly query$: Observable<string | undefined> = this.store.query$;
  protected readonly page$: Observable<number> = this.store.page$;
  protected readonly pageSize$: Observable<number> = this.store.pageSize$;

  protected onPageChange(page: number): void {
    this.store.getPage(page);
  }

  protected onQueryChange(query: string): void {
    this.store.search(query);
  }
}
