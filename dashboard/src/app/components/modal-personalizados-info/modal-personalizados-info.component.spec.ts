import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPersonalizadosInfoComponent } from './modal-personalizados-info.component';

describe('ModalPersonalizadosInfoComponent', () => {
  let component: ModalPersonalizadosInfoComponent;
  let fixture: ComponentFixture<ModalPersonalizadosInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPersonalizadosInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPersonalizadosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
