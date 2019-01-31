import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityAttachmentComponent } from './opportunity-attachment.component';

describe('OpportunityAttachmentComponent', () => {
  let component: OpportunityAttachmentComponent;
  let fixture: ComponentFixture<OpportunityAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
