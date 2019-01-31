import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'person-project-card-brief',
  templateUrl: './person-project-card-brief.component.html',
  styleUrls: ['./person-project-card-brief.component.scss']
})
export class PersonProjectCardBriefComponent implements OnInit {

  @Input() createdUser;
  @Input() content;
  
  constructor() { }

  ngOnInit() {
  }

}
