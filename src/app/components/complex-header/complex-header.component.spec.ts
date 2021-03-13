import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexHeaderComponent } from './complex-header.component';

describe('ComplexHeaderComponent', () => {
  let component: ComplexHeaderComponent;
  let fixture: ComponentFixture<ComplexHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplexHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
