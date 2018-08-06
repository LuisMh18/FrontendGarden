import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercializadorComponent } from './comercializador.component';

describe('ComercializadorComponent', () => {
  let component: ComercializadorComponent;
  let fixture: ComponentFixture<ComercializadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercializadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercializadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
