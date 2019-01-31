import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesCustomerProductProjectComponent } from './add-sales-customer-product-project.component';

describe('AddSalesCustomerProductProjectComponent', () => {
  let component: AddSalesCustomerProductProjectComponent;
  let fixture: ComponentFixture<AddSalesCustomerProductProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesCustomerProductProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesCustomerProductProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
