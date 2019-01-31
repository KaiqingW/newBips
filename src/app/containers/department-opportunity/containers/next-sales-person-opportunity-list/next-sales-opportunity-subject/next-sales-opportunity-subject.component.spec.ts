import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSalesOpportunitySubjectComponent } from './next-sales-opportunity-subject.component';

describe('NextSalesOpportunitySubjectComponent', () => {
  let component: NextSalesOpportunitySubjectComponent;
  let fixture: ComponentFixture<NextSalesOpportunitySubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextSalesOpportunitySubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextSalesOpportunitySubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
