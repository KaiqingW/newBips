import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitySubjectComponent } from './opportunity-subject.component';

describe('OpportunitySubjectComponent', () => {
  let component: OpportunitySubjectComponent;
  let fixture: ComponentFixture<OpportunitySubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunitySubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitySubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
