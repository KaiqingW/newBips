import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuProductCardComponent } from './sku-product-card.component';

describe('SkuProductCardComponent', () => {
  let component: SkuProductCardComponent;
  let fixture: ComponentFixture<SkuProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuProductCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
