import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityPersonProjectComponent } from './opportunity-person-project.component';

describe('OpportunityPersonProjectComponent', () => {
  let component: OpportunityPersonProjectComponent;
  let fixture: ComponentFixture<OpportunityPersonProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityPersonProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityPersonProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
