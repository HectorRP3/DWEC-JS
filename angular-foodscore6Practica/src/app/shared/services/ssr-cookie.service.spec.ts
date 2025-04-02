import { TestBed } from '@angular/core/testing';

import { SsrCookieService } from './ssr-cookie.service';

describe('SsrCookieService', () => {
  let service: SsrCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsrCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
