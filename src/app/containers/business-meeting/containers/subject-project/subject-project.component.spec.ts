import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectProjectComponent } from './subject-project.component';

describe('SubjectProjectComponent', () => {
  let component: SubjectProjectComponent;
  let fixture: ComponentFixture<SubjectProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
