import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsulinFormComponent } from './insulin-form.component';

describe('InsulinFormComponent', () => {
  let component: InsulinFormComponent;
  let fixture: ComponentFixture<InsulinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsulinFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsulinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
