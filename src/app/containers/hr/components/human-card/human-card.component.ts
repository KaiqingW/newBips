import {Component, Input, OnInit  } from '@angular/core';

@Component({
    selector:'human-card',
    templateUrl:'./human-card.component.html',
    styleUrls:['./human-card.component.scss']
})

export class HumanCardComponent{
    @Input() url: string;
    @Input() fname:string;
    @Input() lname:string;
    @Input() position: string;
    @Input() jointime:string;

    constructor(){
        
    }
    ngOnInit(){

    }

}