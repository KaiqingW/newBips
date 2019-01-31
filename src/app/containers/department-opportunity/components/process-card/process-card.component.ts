import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'process-card',
  templateUrl: './process-card.component.html',
  styleUrls: ['./process-card.component.scss']
})
export class ProcessCardComponent implements OnInit {

  @Input() processName : string;
  
  constructor() { }

  ngOnInit() {
  }

}
