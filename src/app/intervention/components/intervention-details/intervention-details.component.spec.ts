import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionDetailsComponent } from './intervention-details.component';

describe('InterventionCreationComponent', () => {
  let component: InterventionDetailsComponent;
  let fixture: ComponentFixture<InterventionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
