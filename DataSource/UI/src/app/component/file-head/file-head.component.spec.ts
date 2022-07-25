import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileHeadComponent } from './file-head.component';

describe('FileHeadComponent', () => {
  let component: FileHeadComponent;
  let fixture: ComponentFixture<FileHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
