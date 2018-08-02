import { TestBed, inject } from '@angular/core/testing';

import { PaginacionService } from './paginacion.service';

describe('PaginacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginacionService]
    });
  });

  it('should be created', inject([PaginacionService], (service: PaginacionService) => {
    expect(service).toBeTruthy();
  }));
});
