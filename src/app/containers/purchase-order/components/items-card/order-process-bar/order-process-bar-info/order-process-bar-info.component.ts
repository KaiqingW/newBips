import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { OrdersService } from '../../../../../../core/services/orders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'order-process-bar-info',
    templateUrl: './order-process-bar-info.component.html',
    styleUrls: ['./order-process-bar-info.component.scss']
})


export class OrderProcessBarInfo implements OnInit, OnChanges {
    @Input() infos;
    @Input() production_infos;
    @Input() shipping_type;
    caption: string;
    company_id: number;

    constructor(private ordersService: OrdersService,
        private route: ActivatedRoute) {
        if(!this.company_id) {
            this.company_id = +this.route.snapshot.paramMap.get('cid');
        }
    }

    ngOnInit() {

    }

    ngOnChanges() {
        if (this.infos && this.infos.length > 0) {
            switch (this.infos[0].type) {
                case 1:
                    if(this.shipping_type && this.shipping_type == 'ocean'){
                        this.caption = 'On the Ocean';
                    } else {
                        this.caption = 'On the Air';
                    }
                    break;
                case 2:
                    this.caption = 'Custom Clearance';
                    break;
                case 3:
                    this.caption = 'Grond Shipping';
                    break;
                case 4:
                    this.caption = 'Received Shipping';
                    break;
                case 5:
                    this.caption = 'Closed Shipping';
                    break;
            }
        }

        if(this.production_infos){
            switch (this.production_infos[0].ifFinish) {
                case -2:
                    this.caption = 'Preparing Production Schedules';
                    break;
                case -1:
                    this.caption = 'Confirmed Production Schedules';
                    break;
            }
        }
    }

    onSelectContainer(info){
        this.ordersService.setContainerNumberMsg(info.container_number);
    }

    getInfo(item) {
        console.log(item[0].is_unread);
        return item[0].is_unread;
    }
}