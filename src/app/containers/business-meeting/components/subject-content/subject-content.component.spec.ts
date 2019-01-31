import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectContentComponent } from './subject-content.component';

describe('SubjectContentComponent', () => {
  let component: SubjectContentComponent;
  let fixture: ComponentFixture<SubjectContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
