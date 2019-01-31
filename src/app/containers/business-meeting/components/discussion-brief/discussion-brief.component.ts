import { Component, OnInit, Input} from '@angular/core';
import { RichText } from 'app/core/models/rich_text';

@Component({
  selector: 'discussion-brief',
  templateUrl: './discussion-brief.component.html',
  styleUrls: ['./discussion-brief.component.scss']
})
export class DiscussionBriefComponent implements OnInit {

  @Input() createdUser;
  @Input() content;
  @Input() unreadRecord : number;
  
  subContent: RichText;

  constructor() { }

  ngOnInit() {    
    this.subContent = JSON.parse(this.content);    
  }
}
