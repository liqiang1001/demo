import { TestBed, inject } from '@angular/core/testing';

import { RiskService } from './risk.service';

describe('RiskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RiskService]
    });
  });

  it('should be created', inject([RiskService], (service: RiskService) => {
    expect(service).toBeTruthy();
  }));
});
