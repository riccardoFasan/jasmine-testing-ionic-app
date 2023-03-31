import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefresherComponent } from './refresher.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('RefresherComponent', () => {
  let component: RefresherComponent;
  let fixture: ComponentFixture<RefresherComponent>;
  let refresher: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefresherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RefresherComponent);
    component = fixture.componentInstance;
    refresher = fixture.debugElement.query(By.css('ion-refresher'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit refresh on scroll down', () => {
    const changeSpy: jasmine.Spy = spyOn(component.refresh, 'emit');
    refresher.triggerEventHandler('ionRefresh');
    expect(changeSpy).toHaveBeenCalled();
  });
});
