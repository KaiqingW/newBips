import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessNotesComponent } from './business-notes.component';

describe('BusinessNotesComponent', () => {
  let component: BusinessNotesComponent;
  let fixture: ComponentFixture<BusinessNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
