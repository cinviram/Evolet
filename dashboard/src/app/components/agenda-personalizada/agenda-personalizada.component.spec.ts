import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaPersonalizadaComponent } from './agenda-personalizada.component';

describe('AgendaPersonalizadaComponent', () => {
  let component: AgendaPersonalizadaComponent;
  let fixture: ComponentFixture<AgendaPersonalizadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaPersonalizadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaPersonalizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
