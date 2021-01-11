import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPersonalizadosCrearComponent } from './modal-personalizados-crear.component';

describe('ModalPersonalizadosCrearComponent', () => {
  let component: ModalPersonalizadosCrearComponent;
  let fixture: ComponentFixture<ModalPersonalizadosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPersonalizadosCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPersonalizadosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
