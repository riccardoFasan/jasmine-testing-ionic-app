import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AphorismsComponent } from './aphorisms.component';

describe('AphorismsComponent', () => {
  let component: AphorismsComponent;
  let fixture: ComponentFixture<AphorismsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AphorismsComponent, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AphorismsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
