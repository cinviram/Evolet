import { TestBed } from '@angular/core/testing';

import { EventosPersonalizazdosService } from './eventos-personalizazdos.service';

describe('EventosPersonalizazdosService', () => {
  let service: EventosPersonalizazdosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventosPersonalizazdosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
