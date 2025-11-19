import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesPage } from './properties-page';

describe('PropertyPage', () => {
  let component: PropertiesPage;
  let fixture: ComponentFixture<PropertiesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
