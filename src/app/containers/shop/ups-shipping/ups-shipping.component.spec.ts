import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsShippingComponent } from './ups-shipping.component';

describe('UpsShippingComponent', () => {
  let component: UpsShippingComponent;
  let fixture: ComponentFixture<UpsShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
