import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotesSubjectComponent } from './add-notes-subject.component';

describe('AddNotesSubjectComponent', () => {
  let component: AddNotesSubjectComponent;
  let fixture: ComponentFixture<AddNotesSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNotesSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotesSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
