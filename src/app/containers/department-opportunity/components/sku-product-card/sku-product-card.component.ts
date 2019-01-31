import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sku-product-card',
  templateUrl: './sku-product-card.component.html',
  styleUrls: ['./sku-product-card.component.scss']
})
export class SkuProductCardComponent implements OnInit {

  @Input() images;
  @Input() productName;
  @Input() productItemNumber;
  
  selectedImg;
  modalOpen;
  
  constructor() { }

  ngOnInit() {
  }

  openModal(url) {
    if (!url) return;
    this.selectedImg = url;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImg = '';
    
  }

}
