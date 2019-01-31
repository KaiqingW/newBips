import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailMessageComponent } from './send-email-message.component';

describe('SendEmailMessageComponent', () => {
  let component: SendEmailMessageComponent;
  let fixture: ComponentFixture<SendEmailMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
