import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ShopService } from '../../../../../core/services/shop.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-company-detail',
    templateUrl: 'company-detail.component.html',
    styleUrls: ['company-detail.component.scss', '../shop-order-detail.component.scss']
})

export class CompanyDetailComponent implements OnInit, OnChanges {
    @Input() company;
    warehouses;
    selectedWarehouse;
    company_id;

    constructor(private shopService : ShopService,
                private route :ActivatedRoute) { }

    ngOnInit() {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        if(!this.company_id){
            this.company_id = 171;
        }
    }

    ngOnChanges(){
        if(this.company){
            this.selectedWarehouse = this.company.shop_order_warehouses[0];
            console.log(this.company);
        }
    }

    changeWarehouse(warehouse){
        this.selectedWarehouse = warehouse;
    }

    onGetSelect(obj){
        this.shopService.updateOrderShippingStatus(this.company_id, this.selectedWarehouse.id, obj).subscribe(
            (res) => {
                // this.getOrder();
            }
        )
    }
}