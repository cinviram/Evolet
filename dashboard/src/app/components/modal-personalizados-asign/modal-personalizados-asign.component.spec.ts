import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPersonalizadosAsignComponent } from './modal-personalizados-asign.component';

describe('ModalPersonalizadosAsignComponent', () => {
  let component: ModalPersonalizadosAsignComponent;
  let fixture: ComponentFixture<ModalPersonalizadosAsignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPersonalizadosAsignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPersonalizadosAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
