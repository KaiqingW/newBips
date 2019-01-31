import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OppoDollarProgressBarComponent } from './oppo-dollar-progress-bar.component';

describe('OppoDollarProgressBarComponent', () => {
  let component: OppoDollarProgressBarComponent;
  let fixture: ComponentFixture<OppoDollarProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OppoDollarProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OppoDollarProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
