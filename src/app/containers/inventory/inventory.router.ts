import { InventoryComponent } from './inventory.component';
import { Routes } from '@angular/router';
import { warehouseDetailHeader, addWarehouseTransactionHeader, searchItemNumHeader, inventoryHeader, productInfoHeader, addProductHeader, editProductHeader, productDetailHeader, addServiceHeader, chooseAddTypeHeader } from 'app/core/models/header';
import { ProductListComponent } from './containers/product-list/product-list.component';
import { ProductInfoComponent } from './containers/product-info/product-info.component';
import { ProductAddComponent } from './containers/product-add/product-add.component';
import { WarehouseDetailCompnent } from './containers/warehouse-detail/warehouse-detail.component';
import { AddWarehouseTransactionComponent } from './containers/add-warehouse-trans/add-warehouse-trans.component';
import { ProductEditComponent } from './containers/product-edit/product-edit.component';
import { ChooseAddTypeCompoent } from './containers/choose-add-type/choose-add-type.component';
import { ServiceAddComponent } from './containers/service-add/service-add.component';

export const InventoryRoutes: Routes = [

    {
        path: 'product',
        component: ProductListComponent,
        data: inventoryHeader
    },
    {
        path: 'product/chooseAddType',
        component: ChooseAddTypeCompoent,
        data: chooseAddTypeHeader
    },
    {
        path: 'product/addService',
        component: ServiceAddComponent,
        data: addServiceHeader
    },
    {
        path: 'product/addProduct',
        component: ProductAddComponent,
        data: addProductHeader
    },
    {
        path: 'product/editProduct/:pid',
        component: ProductEditComponent,
        data: editProductHeader
    },
    {
        path: 'product/:pid',
        component: ProductInfoComponent,
        data: productInfoHeader
    },
    {
        path: 'product/warehouse/:wid',
        component: WarehouseDetailCompnent,
        data: warehouseDetailHeader
    },
    {
        path: 'product/warehouse/:wid/addTransaction',
        component: AddWarehouseTransactionComponent,
        data: addWarehouseTransactionHeader
    }

];
