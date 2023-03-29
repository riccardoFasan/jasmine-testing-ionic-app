import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AphorismsComponent } from './aphorisms.component';
import { AphorismsStoreService } from '../../store';
import { HttpClientModule } from '@angular/common/http';
import { MOCK_PAGE, MOCK_QUERY } from 'src/mocks';

describe('AphorismsComponent', () => {
  let component: AphorismsComponent;
  let fixture: ComponentFixture<AphorismsComponent>;
  let store: AphorismsStoreService;

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

  it('should load a page of aphorisms on page change', () => {
    component.onPageChange(MOCK_PAGE);
    expect(store.getPage).toHaveBeenCalled();
  });

  it('should load a page of aphorisms on query change', () => {
    component.onQueryChange(MOCK_QUERY);
    expect(store.search).toHaveBeenCalledWith(MOCK_QUERY);
  });
});
