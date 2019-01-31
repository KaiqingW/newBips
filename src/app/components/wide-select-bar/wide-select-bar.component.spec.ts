import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WideSelectBarComponent } from './wide-select-bar.component';

describe('WideSelectBarComponent', () => {
  let component: WideSelectBarComponent;
  let fixture: ComponentFixture<WideSelectBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WideSelectBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WideSelectBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
