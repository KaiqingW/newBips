import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarLogoComponent } from './avatar-logo.component';

describe('AvatarLogoComponent', () => {
  let component: AvatarLogoComponent;
  let fixture: ComponentFixture<AvatarLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
