import { TestBed, inject } from '@angular/core/testing';

import { MailconfigService } from './mailconfig.service';

describe('MailconfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MailconfigService]
    });
  });

  it('should be created', inject([MailconfigService], (service: MailconfigService) => {
    expect(service).toBeTruthy();
  }));
});
