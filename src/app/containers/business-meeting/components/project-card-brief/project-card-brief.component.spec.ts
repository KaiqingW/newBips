import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardBriefComponent } from './project-card-brief.component';

describe('ProjectCardBriefComponent', () => {
  let component: ProjectCardBriefComponent;
  let fixture: ComponentFixture<ProjectCardBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectCardBriefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectCardBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
