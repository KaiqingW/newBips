import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotesNoteComponent } from './add-notes-note.component';

describe('AddNotesNoteComponent', () => {
  let component: AddNotesNoteComponent;
  let fixture: ComponentFixture<AddNotesNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNotesNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNotesNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
