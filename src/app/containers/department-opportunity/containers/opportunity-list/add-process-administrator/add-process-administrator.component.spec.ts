import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProcessAdministratorComponent } from './add-process-administrator.component';

describe('AddProcessAdministratorComponent', () => {
  let component: AddProcessAdministratorComponent;
  let fixture: ComponentFixture<AddProcessAdministratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProcessAdministratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProcessAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
