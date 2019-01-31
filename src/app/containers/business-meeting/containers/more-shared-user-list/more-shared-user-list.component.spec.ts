import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreSharedUserListComponent } from './more-shared-user-list.component';

describe('MoreSharedUserListComponent', () => {
  let component: MoreSharedUserListComponent;
  let fixture: ComponentFixture<MoreSharedUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreSharedUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreSharedUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
