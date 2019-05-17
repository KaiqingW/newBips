import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelatedProductsComponent } from './add-related-products.component';

describe('AddRelatedProductsComponent', () => {
  let component: AddRelatedProductsComponent;
  let fixture: ComponentFixture<AddRelatedProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRelatedProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelatedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
