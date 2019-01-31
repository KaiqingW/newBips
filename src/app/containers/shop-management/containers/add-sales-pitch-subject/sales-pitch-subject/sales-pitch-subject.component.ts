import { Component, Input } from '@angular/core';

@Component({
    selector : 'sales-pitch-subject',
    templateUrl : './sales-pitch-subject.component.html',
    styleUrls : ['./sales-pitch-subject.component.html']
})

export class SalesPitchSubjectComponent {
    @Input() salesPitchSubject;

    constructor(){

    }


}