import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionBriefComponent } from './discussion-brief.component';

describe('DiscussionBriefComponent', () => {
  let component: DiscussionBriefComponent;
  let fixture: ComponentFixture<DiscussionBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscussionBriefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
