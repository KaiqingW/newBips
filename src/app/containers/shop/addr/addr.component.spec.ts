import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddrComponent } from './addr.component';

describe('AddrComponent', () => {
  let component: AddrComponent;
  let fixture: ComponentFixture<AddrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
