import { TestBed, inject } from '@angular/core/testing';

import { TackMangementService } from './tack-mangement.service';

describe('TackMangementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TackMangementService]
    });
  });

  it('should be created', inject([TackMangementService], (service: TackMangementService) => {
    expect(service).toBeTruthy();
  }));
});
