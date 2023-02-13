import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDetailsComponent } from './type-details.component';

describe('TypeDetailsComponent', () => {
  let component: TypeDetailsComponent;
  let fixture: ComponentFixture<TypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
