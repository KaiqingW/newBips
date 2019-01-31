import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseSearchInventoryOrAddSKUComponent } from './choose-search-inventory-or-add-sku.component';

describe('ChooseSearchInventoryOrAddSKUComponent', () => {
  let component: ChooseSearchInventoryOrAddSKUComponent;
  let fixture: ComponentFixture<ChooseSearchInventoryOrAddSKUComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseSearchInventoryOrAddSKUComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseSearchInventoryOrAddSKUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
