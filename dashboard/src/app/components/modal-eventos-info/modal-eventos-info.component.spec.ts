import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEventosInfoComponent } from './modal-eventos-info.component';

describe('ModalEventosInfoComponent', () => {
  let component: ModalEventosInfoComponent;
  let fixture: ComponentFixture<ModalEventosInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEventosInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEventosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
