import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'project-card-brief',
  templateUrl: './project-card-brief.component.html',
  styleUrls: ['./project-card-brief.component.scss']
})
export class ProjectCardBriefComponent implements OnInit {

  @Input() createdUser;
  @Input() content;

  constructor() { }

  ngOnInit() {
  }

}
