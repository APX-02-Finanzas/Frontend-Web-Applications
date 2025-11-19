import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPropertiesPage } from './edit-properties-page';

describe('EditPropertiesPage', () => {
  let component: EditPropertiesPage;
  let fixture: ComponentFixture<EditPropertiesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPropertiesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
