import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictEvolutionComponent } from './predict-evolution.component';

describe('PredictEvolutionComponent', () => {
  let component: PredictEvolutionComponent;
  let fixture: ComponentFixture<PredictEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictEvolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
