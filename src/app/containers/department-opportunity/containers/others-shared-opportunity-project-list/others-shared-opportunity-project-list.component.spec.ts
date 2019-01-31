import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersSharedOpportunityProjectListComponent } from './others-shared-opportunity-project-list.component';

describe('OthersSharedOpportunityProjectListComponent', () => {
  let component: OthersSharedOpportunityProjectListComponent;
  let fixture: ComponentFixture<OthersSharedOpportunityProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OthersSharedOpportunityProjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersSharedOpportunityProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
