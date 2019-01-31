import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector:'day-left-bar',
    templateUrl:'day-left-bar.component.html',
    styleUrls:['day-left-bar.component.scss']
})

export class DayLeftBarComponent implements OnInit{
    @Input() dayleft = 5;
    @Input() total = 20;
    possibility = 0.25 ;
    POSSIBILITY = '75%';
    constructor(){

    }

    ngOnInit(){
        
    }
}