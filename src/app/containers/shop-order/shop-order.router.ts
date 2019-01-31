import { Routes } from '@angular/router';
import { shopOrderHeader, yourOrderHeader, shopOrderDetailHeader} from 'app/core/models/header';
import { ShopOrderComponent } from './shop-order.component';
import { ShopOrderDetailComponent } from '../shop-management/containers/shop-order-detail/shop-order-detail.component';
import { OrdersComponent } from './containers/orders/orders.component';


export const ShopOrderRoutes: Routes = [
    {
        path:'',
        component: ShopOrderComponent,
        children: [
            {
                path:'',
                redirectTo: '/shop-order/orders',
                pathMatch: 'full'
            },
            {
                path:'orders',
                component: OrdersComponent,
                data: yourOrderHeader
            },
            {
                path:'orders/user/:ucid/order/:oid',
                component: ShopOrderDetailComponent,
                data: shopOrderDetailHeader
            }
        ]
    },
    // {
    //     path:'main/product/:pid/detail',
    //     component: ShopManagementProductDetail,
    //     data: shopHeader
    // },
  
];
