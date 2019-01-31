import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpportunityComponent } from './add-opportunity.component';

describe('AddOpportunityComponent', () => {
  let component: AddOpportunityComponent;
  let fixture: ComponentFixture<AddOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
