import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgModalComponent } from './img-modal.component';

describe('ImgModalComponent', () => {
  let component: ImgModalComponent;
  let fixture: ComponentFixture<ImgModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
