import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersSharedOpportunityListComponent } from './others-shared-opportunity-list.component';

describe('OthersSharedOpportunityListComponent', () => {
  let component: OthersSharedOpportunityListComponent;
  let fixture: ComponentFixture<OthersSharedOpportunityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersSharedOpportunityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersSharedOpportunityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
