import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformationPopupComponent } from './transformation-popup.component';

describe('TransformationPopupComponent', () => {
  let component: TransformationPopupComponent;
  let fixture: ComponentFixture<TransformationPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformationPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
