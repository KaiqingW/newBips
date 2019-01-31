import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesCustomerOpportunityComponent } from './add-sales-customer-opportunity.component';

describe('AddSalesCustomerOpportunityComponent', () => {
  let component: AddSalesCustomerOpportunityComponent;
  let fixture: ComponentFixture<AddSalesCustomerOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesCustomerOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesCustomerOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
