import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector:'opportunity-card',
    templateUrl:'./opportunity-card.component.html',
    styleUrls:['./opportunity-card.component.scss']
})

export class OpportunityCardComponent implements OnInit{
    comname:string;
    @Input() url:string;
    @Input() first_name:string;
    @Input() last_name: string;
    @Input() description: string;
    @Input() opportunity_name: string;
    @Input() company_name;
    @Input() totalNumber = 5;

    constructor(){

    }

    ngOnInit(){

    }
    
    //get user full name
    userName(first_name, last_name){
        return  this.comname = first_name + " " + last_name;
     }
}
