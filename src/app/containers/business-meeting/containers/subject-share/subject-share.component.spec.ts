import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectShareComponent } from './subject-share.component';

describe('SubjectShareComponent', () => {
  let component: SubjectShareComponent;
  let fixture: ComponentFixture<SubjectShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
