import { TestBed, inject } from '@angular/core/testing';

import { DictService } from './dict.service';

describe('DictService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DictService]
    });
  });

  it('should be created', inject([DictService], (service: DictService) => {
    expect(service).toBeTruthy();
  }));
});
