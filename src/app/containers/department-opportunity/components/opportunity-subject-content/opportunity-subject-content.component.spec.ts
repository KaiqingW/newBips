import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitySubjectContentComponent } from './opportunity-subject-content.component';

describe('OpportunitySubjectContentComponent', () => {
  let component: OpportunitySubjectContentComponent;
  let fixture: ComponentFixture<OpportunitySubjectContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitySubjectContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitySubjectContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
