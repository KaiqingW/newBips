import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSalesPersonOpportunityListComponent } from './next-sales-person-opportunity-list.component';

describe('NextSalesPersonOpportunityListComponent', () => {
  let component: NextSalesPersonOpportunityListComponent;
  let fixture: ComponentFixture<NextSalesPersonOpportunityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextSalesPersonOpportunityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextSalesPersonOpportunityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
