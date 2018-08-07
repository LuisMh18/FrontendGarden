import { TestBed, inject } from '@angular/core/testing';

import { ComercializadorService } from './comercializador.service';

describe('ComercializadorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComercializadorService]
    });
  });

  it('should be created', inject([ComercializadorService], (service: ComercializadorService) => {
    expect(service).toBeTruthy();
  }));
});
