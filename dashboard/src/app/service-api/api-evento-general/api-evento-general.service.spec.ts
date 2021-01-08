import { TestBed } from '@angular/core/testing';

import { ApiEventoGeneralService } from './api-evento-general.service';

describe('ApiEventoGeneralService', () => {
  let service: ApiEventoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiEventoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
