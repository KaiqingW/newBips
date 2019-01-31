import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesNotesListComponent } from './notes-notes-list.component';

describe('NotesNotesListComponent', () => {
  let component: NotesNotesListComponent;
  let fixture: ComponentFixture<NotesNotesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesNotesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesNotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
