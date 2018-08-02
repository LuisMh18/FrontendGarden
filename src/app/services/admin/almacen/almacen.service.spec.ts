import { TestBed, inject } from '@angular/core/testing';

import { AlmacenService } from './almacen.service';

describe('AlmacenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlmacenService]
    });
  });

  it('should be created', inject([AlmacenService], (service: AlmacenService) => {
    expect(service).toBeTruthy();
  }));
});
