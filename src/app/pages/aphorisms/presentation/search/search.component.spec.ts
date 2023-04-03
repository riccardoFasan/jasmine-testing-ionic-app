import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MOCK_QUERY } from 'src/testing/mocks';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let input: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    input = fixture.debugElement.query(By.css('ion-searchbar'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit queryChange event when the user types in the search bar', () => {
    const changeSpy: jasmine.Spy = spyOn(component.queryChange, 'emit');
    input.triggerEventHandler('ionChange', { detail: { value: MOCK_QUERY } });
    fixture.detectChanges();
    expect(changeSpy).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalledWith(MOCK_QUERY);
  });
});
