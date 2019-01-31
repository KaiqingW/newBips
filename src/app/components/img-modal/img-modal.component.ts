import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-img-modal',
  templateUrl: './img-modal.component.html',
  styleUrls: ['./img-modal.component.scss']
})
export class ImgModalComponent implements OnInit {

  @Input() imgSrc;
  @Output() modalClose: EventEmitter<any> = new EventEmitter();


  constructor() { }

  ngOnInit() {
  }

  @HostListener('click') onClick() {
    this.closeModal();
   }

  closeModal() {
    this.modalClose.emit();
  }

}
