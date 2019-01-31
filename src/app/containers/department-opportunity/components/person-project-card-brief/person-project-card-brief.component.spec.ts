import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonProjectCardBriefComponent } from './person-project-card-brief.component';

describe('PersonProjectCardBriefComponent', () => {
  let component: PersonProjectCardBriefComponent;
  let fixture: ComponentFixture<PersonProjectCardBriefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonProjectCardBriefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonProjectCardBriefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
