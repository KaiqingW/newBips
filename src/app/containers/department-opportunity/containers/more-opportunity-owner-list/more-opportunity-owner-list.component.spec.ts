import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOpportunityOwnerListComponent } from './more-opportunity-owner-list.component';

describe('MoreOpportunityOwnerListComponent', () => {
  let component: MoreOpportunityOwnerListComponent;
  let fixture: ComponentFixture<MoreOpportunityOwnerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreOpportunityOwnerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreOpportunityOwnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
