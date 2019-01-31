
import { Routes } from '@angular/router';
import { warehouseHeader, addWarehouseHeader, containerInfoHeader, editContainerInfoHeader, addWarehouseInventoryHeader, addWarehouseInventoryQtyHeader, shopOrderDetailHeader} from 'app/core/models/header';
import { HousesComponent } from './containers/houses/houses.component';
import { AddWarehouseComponent } from './containers/houses/add-warehouse/add-warehouse.component';
import { ShippingsComponent } from './containers/houses/shippings/shippings.component';
import { ContainerInfoComponent } from './containers/houses/container-info/container-info.component';
import { AddWarehouseInventoryComponent } from './containers/add-warehouse-inventory/add-warehouse-inventory.component';
import { AddWarehouseInventoryQtyComponent } from './containers/add-warehouse-inventory-qty/add-warehouse-inventory-qty.component';
import { ShopOrderDetailComponent } from './containers/shop-order-detail/shop-order-detail.component';
import { SendInvoiceComponent } from './containers/send-invoice/send-invoice.component';

export const WarehouseRoutes: Routes = [
    // {
    //     path: '',
    //     redirectTo: "houses"
    // },
    {
        path: 'houses',
        component: HousesComponent,
        data: warehouseHeader
    },
    {
        path: 'houses/addwarehouse',
        component: AddWarehouseComponent,
        data: addWarehouseHeader
    },
    {
        path: 'houses/:wId',
        component: ShippingsComponent,
        data: warehouseHeader
    },
    {
        path: 'houses/:wId/addInventory',
        component: AddWarehouseInventoryComponent,
        data: addWarehouseInventoryHeader
    },
    {
        path: 'houses/:wId/addInventory/qty',
        component: AddWarehouseInventoryQtyComponent,
        data: addWarehouseInventoryQtyHeader
    },
    {
        path: 'houses/:wId/orderItem/:oiId/container/:cname',
        component: ContainerInfoComponent,
        data: containerInfoHeader
    }, 
    {
        path: 'houses/:wId/orderItem/:oiId/container/:cname/edit',
        component: ContainerInfoComponent,
        data: editContainerInfoHeader
    },
    {
        path:'houses/:wId/pending-order/:oid',
        component: ShopOrderDetailComponent,
        data: shopOrderDetailHeader
    },
    {
        path:'houses/:wId/pending-order/:oid/processing',
        component: SendInvoiceComponent,
        data: shopOrderDetailHeader
    }
];
