import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBoxComponent } from './file-box.component';

describe('DropBoxComponent', () => {
  let component: FileBoxComponent;
  let fixture: ComponentFixture<FileBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
