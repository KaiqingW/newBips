import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityShareComponent } from './opportunity-share.component';

describe('OpportunityShareComponent', () => {
  let component: OpportunityShareComponent;
  let fixture: ComponentFixture<OpportunityShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
