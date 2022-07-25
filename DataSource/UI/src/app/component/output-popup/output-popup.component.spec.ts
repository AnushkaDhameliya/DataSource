import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputPopupComponent } from './output-popup.component';

describe('OutputPopupComponent', () => {
  let component: OutputPopupComponent;
  let fixture: ComponentFixture<OutputPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutputPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutputPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
