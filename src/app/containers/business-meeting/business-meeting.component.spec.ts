import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMeetingComponent } from './business-meeting.component';

describe('BusinessMeetingComponent', () => {
  let component: BusinessMeetingComponent;
  let fixture: ComponentFixture<BusinessMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
