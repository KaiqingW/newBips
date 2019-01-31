import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../../../core/services/shop.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-shop-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    orders;
    shop_id : number = 171;
    buyer_info;
    buyer_shop_id : number;

    constructor(private shopService:  ShopService,
                private router: Router,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.getUserVirtualCompany();        
    }

    getUserVirtualCompany(){
        this.shopService.getShoperInfo().subscribe(
            (res) => {
                if(res.user && res.user.employed_companies.length > 0){
                    res.user.employed_companies.forEach((company)=> {
                        if(company.type === 0){
                            this.buyer_info = company;
                            this.buyer_shop_id = +company.id;
                            this.getOrders();
                        }
                    })
                }
            }
        )
    }

    getOrders(){
        this.shopService.getShopPurchaseOrders(this.shop_id, this.buyer_shop_id).subscribe(
            (res) => {
                console.log(res.data);
                this.orders = res.data;
            }
        )
    }

    onGetNav(order_id) {
        order_id = +order_id;
        if(this.buyer_shop_id){
            console.log(this.buyer_shop_id);
            this.router.navigate(['user', this.buyer_shop_id, 'order', order_id], {relativeTo : this.route});
        }
    }

}
