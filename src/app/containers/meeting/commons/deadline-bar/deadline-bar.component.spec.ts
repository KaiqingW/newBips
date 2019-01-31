import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeadlineBarComponent } from './deadline-bar.component';

describe('DeadlineBarComponent', () => {
  let component: DeadlineBarComponent;
  let fixture: ComponentFixture<DeadlineBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeadlineBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeadlineBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
