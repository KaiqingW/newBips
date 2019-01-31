import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector:'employee-card',
    templateUrl:'employee-card.component.html',
    styleUrls:['employee-card.component.scss']
})

export class EmployeeCardComponent implements OnInit{
    @Input() url: string;
    @Input() first_name: string;
    @Input() last_name : string;
    // @Input() 
    totalNumber: number = 6;
    @Input() position:string;
    @Input() email:string;
    comname:string;
    constructor(){
       
    }
    ngOnInit(){

    }

    ngOnchanges(){
        // this.userName();
    }

    userName(first_name, last_name){
       return  this.comname = first_name + " " + last_name;
    }
}
