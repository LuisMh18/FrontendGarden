import { TestBed, inject } from '@angular/core/testing';

import { AgentesService } from './agentes.service';

describe('AgentesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentesService]
    });
  });

  it('should be created', inject([AgentesService], (service: AgentesService) => {
    expect(service).toBeTruthy();
  }));
});
