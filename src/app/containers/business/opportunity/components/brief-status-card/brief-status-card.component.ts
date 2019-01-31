import { Component, OnInit, Input } from '@angular/core';
import { RichText } from 'app/core/models/rich_text';

@Component({
    selector:'brief_status-card',
    templateUrl:'brief-status-card.component.html',
    styleUrls:['brief-status-card.component.scss']
})

export class BriefStatusCardComponent implements OnInit{
    
    @Input() createdUser;
    @Input() content;
    subContent: RichText;

    constructor(){}

    ngOnInit(){

    }

    ngOnChanges() {
        this.subContent = JSON.parse(this.content);  
        console.log(this.subContent)
      }
}