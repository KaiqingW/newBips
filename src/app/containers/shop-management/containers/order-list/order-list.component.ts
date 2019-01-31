import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss']
})

export class OrderListComponent implements OnInit{
    @Input() orders;
    @Output() sendNav = new EventEmitter<any>();
    @Output() sendImg = new EventEmitter<any>();
    constructor(){}

    ngOnInit(){
        console.log(this.orders);
    }

    onGetNav(event){
        this.sendNav.emit(event);
    }

    onGetImg(img){
        this.sendImg.emit(img);
    }
}