import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppoProgressBarComponent } from './oppo-progress-bar.component';

describe('OppoProgressBarComponent', () => {
  let component: OppoProgressBarComponent;
  let fixture: ComponentFixture<OppoProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppoProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppoProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
