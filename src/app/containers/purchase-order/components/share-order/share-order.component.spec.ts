import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareOrderComponent } from './share-order.component';

describe('ShareOrderComponent', () => {
  let component: ShareOrderComponent;
  let fixture: ComponentFixture<ShareOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
