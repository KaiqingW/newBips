import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityPersonProjectDiscussionComponent } from './opportunity-person-project-discussion.component';

describe('OpportunityPersonProjectDiscussionComponent', () => {
  let component: OpportunityPersonProjectDiscussionComponent;
  let fixture: ComponentFixture<OpportunityPersonProjectDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityPersonProjectDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityPersonProjectDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
