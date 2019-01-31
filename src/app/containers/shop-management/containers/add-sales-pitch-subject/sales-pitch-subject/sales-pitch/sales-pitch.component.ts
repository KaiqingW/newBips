import { Component, Input } from '@angular/core';

@Component({
    selector : 'sales-pitch',
    templateUrl : './sales-pitch.component.html',
    styleUrls : ['./sales-pitch.component.html']
})

export class SalesPitchComponent{
    @Input() salesPitch;
    @Input() index;
    constructor () {

    }


}