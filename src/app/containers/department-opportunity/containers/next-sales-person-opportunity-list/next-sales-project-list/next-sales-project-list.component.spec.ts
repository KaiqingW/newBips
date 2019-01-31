import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSalesProjectListComponent } from './next-sales-project-list.component';

describe('NextSalesProjectListComponent', () => {
  let component: NextSalesProjectListComponent;
  let fixture: ComponentFixture<NextSalesProjectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NextSalesProjectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NextSalesProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
