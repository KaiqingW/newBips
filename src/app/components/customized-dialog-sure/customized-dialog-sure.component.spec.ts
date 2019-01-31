import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizedDialogSureComponent } from './customized-dialog-sure.component';

describe('CustomizedDialogSureComponent', () => {
  let component: CustomizedDialogSureComponent;
  let fixture: ComponentFixture<CustomizedDialogSureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizedDialogSureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizedDialogSureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
