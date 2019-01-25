import { TestBed, inject } from '@angular/core/testing';

import { GovernService } from './govern.service';

describe('GovernService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GovernService]
    });
  });

  it('should be created', inject([GovernService], (service: GovernService) => {
    expect(service).toBeTruthy();
  }));
});
