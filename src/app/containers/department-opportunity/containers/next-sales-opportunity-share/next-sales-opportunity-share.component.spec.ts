import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSalesOpportunityShareComponent } from './next-sales-opportunity-share.component';

describe('NextSalesOpportunityShareComponent', () => {
  let component: NextSalesOpportunityShareComponent;
  let fixture: ComponentFixture<NextSalesOpportunityShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextSalesOpportunityShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextSalesOpportunityShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
