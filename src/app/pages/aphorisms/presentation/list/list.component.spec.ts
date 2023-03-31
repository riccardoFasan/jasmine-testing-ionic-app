import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MOCK_APHORISMS_LIST } from 'src/mocks';
import { take } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let infiniteScroll: DebugElement;
  let refresher: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new aphorisms on aphorisms page change', () => {
    component.aphorisms = MOCK_APHORISMS_LIST.items;
    fixture.detectChanges();
    component.aphorisms$.pipe(take(1)).subscribe((aphorisms) => {
      expect(aphorisms).toEqual(
        jasmine.arrayContaining(MOCK_APHORISMS_LIST.items)
      );
    });
  });

  it('should clear the aphorirms list on query change', () => {
    component.query = 'query';
    fixture.detectChanges();
    component.aphorisms$.pipe(take(1)).subscribe((aphorisms) => {
      expect(aphorisms).toEqual([]);
    });
  });

  it('should emit pageChange on scroll', () => {
    const changeSpy: jasmine.Spy = spyOn(component.pageChange, 'emit');

    component.aphorisms = MOCK_APHORISMS_LIST.items;
    component.count = MOCK_APHORISMS_LIST.count;
    component.pages = MOCK_APHORISMS_LIST.pages;
    component.page = 1;
    component.pageSize = MOCK_APHORISMS_LIST.pageSize;
    fixture.detectChanges();
    infiniteScroll = fixture.debugElement.query(By.css('ion-infinite-scroll'));

    infiniteScroll.triggerEventHandler('ionInfinite');
    expect(changeSpy).toHaveBeenCalled();
  });

  it('should not emit pageChange if all pages are loaded', () => {
    const changeSpy: jasmine.Spy = spyOn(component.pageChange, 'emit');

    component.aphorisms = MOCK_APHORISMS_LIST.items;
    component.count = MOCK_APHORISMS_LIST.count;
    component.pages = MOCK_APHORISMS_LIST.pages;
    component.page = MOCK_APHORISMS_LIST.currentPage;
    component.pageSize = MOCK_APHORISMS_LIST.pageSize;
    fixture.detectChanges();

    infiniteScroll = fixture.debugElement.query(By.css('ion-infinite-scroll'));

    infiniteScroll.triggerEventHandler('ionInfinite');
    fixture.detectChanges();

    expect(changeSpy).not.toHaveBeenCalled();
  });

  it('should load the fisrt page of aphorisms on page refresh', () => {
    const changeSpy: jasmine.Spy = spyOn(component.pageChange, 'emit');
    refresher = fixture.debugElement.query(By.css('ion-refresher'));
    refresher.triggerEventHandler('ionRefresh');
    expect(changeSpy).toHaveBeenCalledWith(1);
  });
});
