import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftDayBarComponent } from './left-day-bar.component';

describe('LeftDayBarComponent', () => {
  let component: LeftDayBarComponent;
  let fixture: ComponentFixture<LeftDayBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftDayBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftDayBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
