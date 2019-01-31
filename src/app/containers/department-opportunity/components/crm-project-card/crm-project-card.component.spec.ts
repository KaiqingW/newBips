import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmProjectCardComponent } from './crm-project-card.component';

describe('CrmProjectCardComponent', () => {
  let component: CrmProjectCardComponent;
  let fixture: ComponentFixture<CrmProjectCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmProjectCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
