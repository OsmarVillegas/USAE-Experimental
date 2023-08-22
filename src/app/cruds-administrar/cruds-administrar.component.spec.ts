import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudsAdministrarComponent } from './cruds-administrar.component';

describe('CrudsAdministrarComponent', () => {
  let component: CrudsAdministrarComponent;
  let fixture: ComponentFixture<CrudsAdministrarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudsAdministrarComponent]
    });
    fixture = TestBed.createComponent(CrudsAdministrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
