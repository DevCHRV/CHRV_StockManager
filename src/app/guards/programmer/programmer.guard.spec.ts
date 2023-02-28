import { TestBed } from '@angular/core/testing';

import { ProgrammerGuard } from './programmer.guard';

describe('ProgrammerGuard', () => {
  let guard: ProgrammerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProgrammerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
