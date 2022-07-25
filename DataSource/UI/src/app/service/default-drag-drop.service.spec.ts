import { TestBed } from '@angular/core/testing';

import { DefaultDragDropService } from './default-drag-drop.service';

describe('DefaultDragDropService', () => {
  let service: DefaultDragDropService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultDragDropService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
