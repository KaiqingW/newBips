import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNextSubjectListComponent } from './project-next-subject-list.component';

describe('ProjectNextSubjectListComponent', () => {
  let component: ProjectNextSubjectListComponent;
  let fixture: ComponentFixture<ProjectNextSubjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectNextSubjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectNextSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
