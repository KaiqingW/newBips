import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'department-template-selector',
    templateUrl: './department-template-selector.component.html'
})

export class DepartmentTemplateSelectorComponent implements OnInit, OnChanges {
    @Input() row;
    
    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges() {
        console.log('row', this.row);
    }
}