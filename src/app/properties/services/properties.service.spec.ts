import { TestBed } from '@angular/core/testing';

import { PopertiesService } from './properties.service';

describe('PopertiesService', () => {
  let service: PopertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
