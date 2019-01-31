import { TestBed, inject } from '@angular/core/testing';

import { LoggingUserService } from './logging-user.service';

describe('LoggingUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggingUserService]
    });
  });

  it('should be created', inject([LoggingUserService], (service: LoggingUserService) => {
    expect(service).toBeTruthy();
  }));
});
