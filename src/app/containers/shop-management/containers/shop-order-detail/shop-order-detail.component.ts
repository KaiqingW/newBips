import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../../core/services/shop.service';

@Component({
    selector: 'app-shop-order-detail',
    templateUrl: './shop-order-detail.component.html',
    styleUrls: ['./shop-order-detail.component.scss']
})

export class ShopOrderDetailComponent implements OnInit {
    order;
    order_id : number;
    company_id : number;
    warehouses;
    selectedWarehouse;
    isLoading : boolean = false;
    companies;
    total_shipping_fee;

    constructor(private route :ActivatedRoute,
                private shopService: ShopService) { }

    ngOnInit() {
        this.company_id = +this.route.snapshot.paramMap.get('cid');
        this.order_id = +this.route.snapshot.paramMap.get('oid');
        if(!this.company_id){
            this.company_id = 171;
        }
        this.getOrder();
    }

    getOrder(){
        this.shopService.getShopOrderDetail(this.company_id , this.order_id).subscribe(
            res => {
                console.log(res);
                this.order = res;
                this.companies = res.shop_companies;
                this.total_shipping_fee = this.order.shop_companies.map(x => x.total_shipping_fee).reduce((a, b) => +a + +b);
                console.log(this.total_shipping_fee);
            }
        )
    }


}