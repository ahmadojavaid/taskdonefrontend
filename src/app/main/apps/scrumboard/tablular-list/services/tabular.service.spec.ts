import { TestBed, inject } from '@angular/core/testing';

import { TabularService } from './tabular-service.service';

describe('TabularService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabularService]
    });
  });

  it('should be created', inject([TabularService], (service: TabularService) => {
    expect(service).toBeTruthy();
  }));
});
