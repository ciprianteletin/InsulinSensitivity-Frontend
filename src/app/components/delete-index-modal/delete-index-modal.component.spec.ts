import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteIndexModalComponent } from './delete-index-modal.component';

describe('DeleteIndexModalComponent', () => {
  let component: DeleteIndexModalComponent;
  let fixture: ComponentFixture<DeleteIndexModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteIndexModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteIndexModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
