import { TestBed } from '@angular/core/testing';

import { ComplianService } from './complian.service';

describe('ComplianService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComplianService = TestBed.get(ComplianService);
    expect(service).toBeTruthy();
  });
});
