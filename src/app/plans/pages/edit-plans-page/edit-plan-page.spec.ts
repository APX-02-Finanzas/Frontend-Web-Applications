import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanPage } from './edit-plan-page';

describe('EditPlanPage', () => {
  let component: EditPlanPage;
  let fixture: ComponentFixture<EditPlanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlanPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
