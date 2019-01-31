import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishedSubjectListComponent } from './finished-subject-list.component';

describe('FinishedSubjectListComponent', () => {
  let component: FinishedSubjectListComponent;
  let fixture: ComponentFixture<FinishedSubjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishedSubjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishedSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
