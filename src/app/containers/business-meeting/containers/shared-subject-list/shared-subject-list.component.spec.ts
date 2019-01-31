import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSubjectListComponent } from './shared-subject-list.component';

describe('SharedSubjectListComponent', () => {
  let component: SharedSubjectListComponent;
  let fixture: ComponentFixture<SharedSubjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedSubjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
