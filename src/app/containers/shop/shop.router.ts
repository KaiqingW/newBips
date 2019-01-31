import { ShopComponent } from './shop.component';
import { Routes } from '@angular/router';
import { ItemComponent } from './item/item.component';
import { DepartmentComponent } from './department/department.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AddrComponent } from './addr/addr.component';
import { ChooseWhsComponent } from './choose-whs/choose-whs.component';
import { itemHeader, cartHeader, checkoutHeader } from 'app/core/models/header';

export const ShopRoutes: Routes = [
    { 
        path: '',
        component: ShopComponent
    },
    {
        path: 'item/:cid/:pid',
        runGuardsAndResolvers: 'paramsChange',
        component: ItemComponent,
        data: itemHeader
    },
    {
        path: 'item/:category',
        runGuardsAndResolvers: 'paramsChange',
        component: DepartmentComponent,
        data: itemHeader
    },
    {
        path: 'shopping-cart',
        component: CartComponent,
        data: cartHeader
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        data: checkoutHeader
    },
    {
        path: 'addr',
        component: AddrComponent,
        data: checkoutHeader
    },
    {
        path: 'whs',
        component: ChooseWhsComponent,
        data: checkoutHeader
    },
];