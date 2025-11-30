import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsFormPage } from './claims-form-page';

describe('ClaimsFormPage', () => {
  let component: ClaimsFormPage;
  let fixture: ComponentFixture<ClaimsFormPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimsFormPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimsFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
