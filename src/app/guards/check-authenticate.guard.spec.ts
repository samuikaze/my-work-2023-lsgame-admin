import { TestBed } from '@angular/core/testing';

import { CheckAuthenticateGuard } from './check-authenticate.guard';

describe('CheckAuthenticateGuard', () => {
  let guard: CheckAuthenticateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckAuthenticateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
