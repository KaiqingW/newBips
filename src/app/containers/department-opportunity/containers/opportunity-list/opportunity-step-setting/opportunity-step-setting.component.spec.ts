import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityStepSettingComponent } from './opportunity-step-setting.component';

describe('OpportunityStepSettingComponent', () => {
  let component: OpportunityStepSettingComponent;
  let fixture: ComponentFixture<OpportunityStepSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityStepSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityStepSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
