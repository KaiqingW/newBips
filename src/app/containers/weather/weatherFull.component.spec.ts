import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherFullComponent } from './weatherFull.component';

describe('WeatherComponent', () => {
  let component: WeatherFullComponent;
  let fixture: ComponentFixture<WeatherFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
