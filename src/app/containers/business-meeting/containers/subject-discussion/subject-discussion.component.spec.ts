import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectDiscussionComponent } from './subject-discussion.component';

describe('SubjectDiscussionComponent', () => {
  let component: SubjectDiscussionComponent;
  let fixture: ComponentFixture<SubjectDiscussionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectDiscussionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
