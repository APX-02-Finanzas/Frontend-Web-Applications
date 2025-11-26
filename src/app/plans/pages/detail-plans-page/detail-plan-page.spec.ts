import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlanPage } from './detail-plan-page';

describe('DetailPlanPage', () => {
  let component: DetailPlanPage;
  let fixture: ComponentFixture<DetailPlanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPlanPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
