import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreProcessAdministratorsComponent } from './more-process-administrators.component';

describe('MoreProcessAdministratorsComponent', () => {
  let component: MoreProcessAdministratorsComponent;
  let fixture: ComponentFixture<MoreProcessAdministratorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreProcessAdministratorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreProcessAdministratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
