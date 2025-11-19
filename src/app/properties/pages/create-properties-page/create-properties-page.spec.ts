import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePropertiesPage } from './create-properties-page';

describe('CreatePropertiesPage', () => {
  let component: CreatePropertiesPage;
  let fixture: ComponentFixture<CreatePropertiesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePropertiesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
