import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreProjectOwnerListComponent } from './more-project-owner-list.component';

describe('MoreProjectOwnerListComponent', () => {
  let component: MoreProjectOwnerListComponent;
  let fixture: ComponentFixture<MoreProjectOwnerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreProjectOwnerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreProjectOwnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
