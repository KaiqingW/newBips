import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitySubjectDiscussionComponent } from './opportunity-subject-discussion.component';

describe('OpportunitySubjectDiscussionComponent', () => {
  let component: OpportunitySubjectDiscussionComponent;
  let fixture: ComponentFixture<OpportunitySubjectDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitySubjectDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitySubjectDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
