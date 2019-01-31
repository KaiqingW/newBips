import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailMessageComponent } from './edit-email-message.component';

describe('EditEmailMessageComponent', () => {
  let component: EditEmailMessageComponent;
  let fixture: ComponentFixture<EditEmailMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmailMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
