import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonProjectCardComponent } from './person-project-card.component';

describe('PersonProjectCardComponent', () => {
  let component: PersonProjectCardComponent;
  let fixture: ComponentFixture<PersonProjectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonProjectCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
