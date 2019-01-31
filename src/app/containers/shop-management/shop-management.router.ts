import { Routes } from '@angular/router';
import { shopHeader, shopManagementEditHeader, shopManagementAddHeader, shopOrderDetailHeader, addSalesPitchSubjectHeader } from 'app/core/models/header';

import { ShopManagementComponent } from './shop-management.component';
import { ShopManagementProductEditComponent } from './containers/shop-management-product-edit/shop-management-product-edit.component';
import { AddShopProductComponent } from './containers/add-shop-product/add-shop-product.component';
import { ShopComponent } from './containers/shop/shop.component';
import { ShopOrderDetailComponent } from './containers/shop-order-detail/shop-order-detail.component';
import { AddSalesPitchSubjectComponent } from './containers/add-sales-pitch-subject/add-sales-pitch-subject.component';


export const ShopManagementRoutes: Routes = [
    // {
    //     path: '',
    //     component: ShopManagementComponent,
    //     children: [
    //         {
    //             path: '',
    //             redirectTo: 'main',
    //             pathMatch: 'full'
    //         },
    //         {
    //             path: 'main',
    //             component: ShopComponent,
    //             data: shopHeader
    //         }
    //     ]
    // }
    {
        path:'main',
        component: ShopComponent,
        data: shopHeader
    },
    // {
    //     path:'main/product/:pid/detail',
    //     component: ShopManagementProductDetail,
    //     data: shopHeader
    // },
    {
        path:'main/product/:pid/edit',
        component: ShopManagementProductEditComponent,
        data: shopManagementEditHeader
    },
    {
        path:'main/product/:pid/edit/addSalesSubject',
        component: AddSalesPitchSubjectComponent,
        data: addSalesPitchSubjectHeader
    },
    {
        path:'main/product/add',
        component: AddShopProductComponent,
        data: shopManagementAddHeader
    },
    {
        path:'main/order/:oid',
        component: ShopOrderDetailComponent,
        data: shopOrderDetailHeader
    }
];
