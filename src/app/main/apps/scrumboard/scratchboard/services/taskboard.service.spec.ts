import { TestBed, inject } from '@angular/core/testing';

import { TaskboardService } from './taskboard.service';

describe('TaskboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskboardService]
    });
  });

  it('should be created', inject([TaskboardService], (service: TaskboardService) => {
    expect(service).toBeTruthy();
  }));
});
