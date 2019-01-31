import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentOpportunityComponent } from './department-opportunity.component';

describe('DepartmentOpportunityComponent', () => {
  let component: DepartmentOpportunityComponent;
  let fixture: ComponentFixture<DepartmentOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
