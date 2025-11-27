import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlanPage } from './create-plan-page';

describe('CreatePlanPage', () => {
  let component: CreatePlanPage;
  let fixture: ComponentFixture<CreatePlanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlanPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
