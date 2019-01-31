import { Component, OnInit, Input, HostListener, ElementRef, Renderer } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss']
})
export class AddressCardComponent implements OnInit {

  @Input() title : string;
  @Input() address;

  constructor(private router: Router) { }

  ngOnInit() {
  
  }

}
