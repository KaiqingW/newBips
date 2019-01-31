import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShippedComponent } from './add-shipped.component';

describe('AddShippedComponent', () => {
  let component: AddShippedComponent;
  let fixture: ComponentFixture<AddShippedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShippedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
