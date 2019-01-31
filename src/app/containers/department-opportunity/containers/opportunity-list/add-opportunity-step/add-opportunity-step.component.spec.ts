import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpportunityStepComponent } from './add-opportunity-step.component';

describe('AddOpportunityStepComponent', () => {
  let component: AddOpportunityStepComponent;
  let fixture: ComponentFixture<AddOpportunityStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOpportunityStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpportunityStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
