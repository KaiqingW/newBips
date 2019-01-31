import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseWhsComponent } from './choose-whs.component';

describe('ChooseWhsComponent', () => {
  let component: ChooseWhsComponent;
  let fixture: ComponentFixture<ChooseWhsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseWhsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseWhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
