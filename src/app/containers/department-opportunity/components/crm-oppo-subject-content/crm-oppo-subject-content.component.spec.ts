import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmOppoSubjectContentComponent } from './crm-oppo-subject-content.component';

describe('CrmOppoSubjectContentComponent', () => {
  let component: CrmOppoSubjectContentComponent;
  let fixture: ComponentFixture<CrmOppoSubjectContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmOppoSubjectContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmOppoSubjectContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
