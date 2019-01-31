import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApproveDenyComponent } from './add-approve-deny.component';

describe('AddApproveDenyComponent', () => {
  let component: AddApproveDenyComponent;
  let fixture: ComponentFixture<AddApproveDenyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddApproveDenyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApproveDenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
