import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceImportComponent } from './licence-import.component';

describe('ItemImportComponent', () => {
  let component: LicenceImportComponent;
  let fixture: ComponentFixture<LicenceImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenceImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
