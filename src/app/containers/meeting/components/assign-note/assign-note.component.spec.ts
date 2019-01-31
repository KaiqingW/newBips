import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignNoteComponent } from './assign-note.component';

describe('AssignNoteComponent', () => {
  let component: AssignNoteComponent;
  let fixture: ComponentFixture<AssignNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
