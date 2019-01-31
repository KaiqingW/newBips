import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'order-container-status',
    templateUrl: './container_status.component.html',
    styleUrls: ['./container_status.component.scss']
})


export class OrderContainerStatus implements OnInit, OnChanges {
    @Input() container_info;
    @Input() status;
    style_left;
    transform;

    constructor() {

    }

    ngOnInit() {
        
    }

    ngOnChanges(){
        if(this.container_info && this.status){
            this.getRightPosition(this.container_info.type + 2);
            this.getTransform(this.container_info.type + 2);
        }
    }

     getRightPosition(status) {
        this.style_left = status / (this.status.length - 1) * 100 + '%';
    }

    getTransform(status) {
        if (status == 0) {
            this.transform = 'translateX(0)';
        } else if (status == 7) {
            this.transform = 'translateX(-100%)';
        } else {
            this.transform = 'translateX(-50%)';
        }
    }
}