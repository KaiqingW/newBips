import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-order-history-card',
    templateUrl: './order-history-card.component.html',
    styleUrls: ['./order-history-card.component.scss']
})

export class OrderHistoryCardComponent implements OnInit {
    @Input() orders;
    @Output() sendNav = new EventEmitter<any>();
    selectedOrder;
    @Output() sendImg = new EventEmitter<string>();

    constructor(private router: Router) { }

    ngOnInit() {
        console.log(this.orders);
    }


    selectOrder(order) {

    }

    onNavToDetail(event, id) {
        this.sendNav.emit(id);
    }


    openModal(img) {
        this.sendImg.emit(img);
    }

}