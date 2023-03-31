import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AphorismsComponent } from './aphorisms.component';
import { AphorismsStoreService } from '../../store';
import { HttpClientModule } from '@angular/common/http';
import { MOCK_PAGE, MOCK_QUERY } from 'src/mocks';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AphorismsComponent', () => {
  let component: AphorismsComponent;
  let fixture: ComponentFixture<AphorismsComponent>;
  let store: AphorismsStoreService;
  let searchbar: DebugElement;
  let list: DebugElement;

  beforeEach(async () => {
    const storeServiceSpy: jasmine.SpyObj<AphorismsStoreService> =
      jasmine.createSpyObj('AphorismsStoreService', ['search', 'getPage']);

    await TestBed.configureTestingModule({
      imports: [AphorismsComponent, IonicModule.forRoot(), HttpClientModule],
    }).compileComponents();

    TestBed.overrideProvider(AphorismsStoreService, {
      useValue: storeServiceSpy,
    });

    fixture = TestBed.createComponent(AphorismsComponent);
    store = TestBed.inject(AphorismsStoreService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should load a page of aphorisms on query change', () => {
    searchbar = fixture.debugElement.query(By.css('app-search'));
    searchbar.triggerEventHandler('queryChange', MOCK_QUERY);
    expect(store.search).toHaveBeenCalledWith(MOCK_QUERY);
  });

  it('should load a page of aphorisms on page change', () => {
    list = fixture.debugElement.query(By.css('app-list'));
    list.triggerEventHandler('pageChange', MOCK_PAGE);
    expect(store.getPage).toHaveBeenCalledWith(MOCK_PAGE);
  });
});
