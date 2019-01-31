import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitySubjectCardComponent } from './opportunity-subject-card.component';

describe('OpportunitySubjectCardComponent', () => {
  let component: OpportunitySubjectCardComponent;
  let fixture: ComponentFixture<OpportunitySubjectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitySubjectCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitySubjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
