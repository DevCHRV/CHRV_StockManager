import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeCreationComponent } from './type-creation.component';

describe('TypeCreationComponent', () => {
  let component: TypeCreationComponent;
  let fixture: ComponentFixture<TypeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
