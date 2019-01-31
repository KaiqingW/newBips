import { Component, OnInit, Input, HostListener, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() title1 : string;
  @Input() des1 : string;
  @Input() title2 : string;
  @Input() des2 : string;
  @Input() imgUrl: string;
  
  selectedProduct;

  constructor(
              private router: Router) { }

  ngOnInit() {
  
  }

}
