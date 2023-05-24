import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { APHORISM_WITH_IMAGE, APHORISM_WITH_NO_IMAGE } from 'src/testing';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the aphorism content, the work title and the author name', () => {
    component.aphorism = APHORISM_WITH_NO_IMAGE;
    fixture.detectChanges();

    const content: HTMLElement | null =
      fixture.nativeElement.querySelector('blockquote');
    expect(content?.textContent).toContain(APHORISM_WITH_NO_IMAGE.content);

    const work: HTMLElement | null =
      fixture.nativeElement.querySelector('cite');
    expect(work?.textContent).toContain(
      `${APHORISM_WITH_NO_IMAGE.work.title} - ${APHORISM_WITH_NO_IMAGE.work.author.name}`
    );
  });

  it('should not display an image if the aphorism has no image', () => {
    component.aphorism = APHORISM_WITH_NO_IMAGE;
    fixture.detectChanges();
    const image: HTMLImageElement | null =
      fixture.nativeElement.querySelector('ion-img');
    expect(image).toBeFalsy();
  });

  it('should display an image if the aphorism has an image', () => {
    component.aphorism = APHORISM_WITH_IMAGE;
    fixture.detectChanges();
    const image: HTMLImageElement | null =
      fixture.nativeElement.querySelector('ion-img');
    expect(image).toBeTruthy();
    expect(image?.src).toContain(APHORISM_WITH_IMAGE.image);
  });
});
