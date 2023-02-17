import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionCreationComponent } from './intervention-creation.component';

describe('InterventionCreationComponent', () => {
  let component: InterventionCreationComponent;
  let fixture: ComponentFixture<InterventionCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterventionCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
