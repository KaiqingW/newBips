import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityProcessAttachmentComponent } from './opportunity-process-attachment.component';

describe('OpportunityProcessAttachmentComponent', () => {
  let component: OpportunityProcessAttachmentComponent;
  let fixture: ComponentFixture<OpportunityProcessAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityProcessAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityProcessAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
