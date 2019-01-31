import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignComponent } from './project-assign.component';

describe('ProjectAssignComponent', () => {
  let component: ProjectAssignComponent;
  let fixture: ComponentFixture<ProjectAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
