import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AphorismsComponent } from './aphorisms.component';
import { AphorismsStoreService } from '../../store';
import { HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Aphorism } from '@app/core/models';

const MOCK_INITIAL_APHORISMS: Observable<Aphorism[]> = of([]);
const MOCK_INITIAL_LOADING: Observable<boolean> = of(false);
const MOCK_INITIAL_COUNT: Observable<number> = of(0);
const MOCK_INITIAL_QUERY: Observable<string | undefined> = of(undefined);
const MOCK_INITIAL_PAGE: Observable<number> = of(1);
const MOCK_INITIAL_PAGE_SIZE: Observable<number> = of(10);

describe('AphorismsComponent', () => {
  let component: AphorismsComponent;
  let fixture: ComponentFixture<AphorismsComponent>;

  beforeEach(async () => {
    const storeSpy: jasmine.SpyObj<AphorismsStoreService> =
      jasmine.createSpyObj('AphorismsStoreService', ['search', 'getPage'], {
        aphorisms$: MOCK_INITIAL_APHORISMS,
        loading$: MOCK_INITIAL_LOADING,
        count$: MOCK_INITIAL_COUNT,
        query$: MOCK_INITIAL_QUERY,
        page$: MOCK_INITIAL_PAGE,
        pageSize$: MOCK_INITIAL_PAGE_SIZE,
      });

    await TestBed.configureTestingModule({
      imports: [AphorismsComponent, IonicModule.forRoot(), HttpClientModule],
      providers: [{ provide: AphorismsStoreService, useValue: storeSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AphorismsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  // should load a page of aphorisms on page change

  // should load a page of aphorisms on query change
});
