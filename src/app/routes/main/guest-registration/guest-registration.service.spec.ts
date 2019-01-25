import { TestBed } from '@angular/core/testing';

import { GuestRegistrationService } from './guest-registration.service';

describe('GuestRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuestRegistrationService = TestBed.get(GuestRegistrationService);
    expect(service).toBeTruthy();
  });
});
