import { Component, OnInit, OnChanges, Input, HostListener, Output, ElementRef, Renderer, EventEmitter } from '@angular/core';

@Component({
  selector: 'viewed-icon',
  templateUrl: './viewed-icon.component.html',
  styleUrls: ['./viewed-icon.component.scss']
})

export class ViewedIconComponent implements OnInit {
  @Input() previous;

  constructor() { }

  ngOnInit() {
   
  }

 

}
