import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpportunityPersonProjectComponent } from './add-opportunity-person-project.component';

describe('AddOpportunityPersonProjectComponent', () => {
  let component: AddOpportunityPersonProjectComponent;
  let fixture: ComponentFixture<AddOpportunityPersonProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOpportunityPersonProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpportunityPersonProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
