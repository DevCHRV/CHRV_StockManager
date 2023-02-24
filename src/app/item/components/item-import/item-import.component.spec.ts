import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemImportComponent } from './item-import.component';

describe('ItemImportComponent', () => {
  let component: ItemImportComponent;
  let fixture: ComponentFixture<ItemImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
