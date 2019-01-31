import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesSubjectDetailComponent } from './notes-subject-detail.component';

describe('NotesSubjectDetailComponent', () => {
  let component: NotesSubjectDetailComponent;
  let fixture: ComponentFixture<NotesSubjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesSubjectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesSubjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
