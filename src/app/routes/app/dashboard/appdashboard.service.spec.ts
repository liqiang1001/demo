import { TestBed } from '@angular/core/testing';

import { AppdashboardService } from './appdashboard.service';

describe('AppdashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppdashboardService = TestBed.get(AppdashboardService);
    expect(service).toBeTruthy();
  });
});
