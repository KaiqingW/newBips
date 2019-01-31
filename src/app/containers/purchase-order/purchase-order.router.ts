import { PurchaseOrderComponent } from './purchase-order.component';
import { Routes } from '@angular/router';
import { addOrderContactHeader, sharedOrdersHeader, businessSubjecDetailHeader, addBusinessSubjectHeader, businessSubjectListHeader, ordersHeader, newOrderHeader, noteDetailHeader, newOrderNotesSubjectHeader, newOrderItemHeader, orderDetailsHeader, updateArriveDateHeader, orderStatusHeader, companyPurchaseOrder, companySalesOrder, newShippedOrderHeader, orderJustShowAttachemntsHeader, editOrderStatusHeader } from 'app/core/models/header';
import { OrdersComponent } from './components/orders/orders.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderStatusComponent } from './components/order-status/order-status.component';
import { CompanyPurchaseOrderComponent } from './components/company-purchase-order/company-purchase-order.component';
import { CompanySalesOrderComponent } from './components/company-salesorder/company-salesorder.component';
import { UpdateShippedInfoComponent } from './components/order-status/update-shipped-info/update-shipped-info.component';
import { AddShippedComponent } from './components/order-status/add-shipped/add-shipped.component';
import { NewOrderItemComponent } from './components/new-order/new-order-item/new-order-item.component';
import { AddNotesSubjectComponent } from 'app/components/business-notes/add-notes-subject/add-notes-subject.component';
import { NotesSubjectDetailComponent } from 'app/components/business-notes/notes-subject-detail/notes-subject-detail.component';
import { ShareOrderComponent } from './components/share-order/share-order.component';
import { VrmOrdersComponent } from './components/vrm-orders/vrm-orders.component';
import { OrderAttachemntsComponent } from './components/attachments/attachments.component';
import { EditOrderStatusComponent } from './components/order-status/edit-order-status/edit-order-status.component';

export const PurchaseOrderRoutes: Routes = [

    {
        path: 'orders',
        component: OrdersComponent,
        data: ordersHeader
    },
    {
        path: 'orders/vrm',
        component: VrmOrdersComponent,
        data: sharedOrdersHeader
    },
    {
        path: 'orders/vrm/:oId',
        component: OrderDetailsComponent,
        data: orderDetailsHeader
    },
    {
        path: 'orders/vrm/:oId/item/:iId',
        component: OrderStatusComponent,
        data: orderStatusHeader
    },
    {
        path: 'orders/vrm/:oId/item/:iId/attachments',
        component: OrderAttachemntsComponent,
        data: orderJustShowAttachemntsHeader
    },
    {
        path: 'orders/vrm/:oId/item/:iId/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },
    {
        path: 'orders/new',
        component: NewOrderComponent,
        data: newOrderHeader
    },
    {
        path: 'orders/new/newOrderItem',
        component: NewOrderItemComponent,
        data: newOrderItemHeader
    },
    {
        path: 'orders/:oId',
        component: OrderDetailsComponent,
        data: orderDetailsHeader
    },
    {
        path: 'orders/:oId/item/:iId',
        component: OrderStatusComponent,
        data: orderStatusHeader
    },
    {
        path: 'orders/:oId/item/:iId/edit',
        component: EditOrderStatusComponent,
        data: editOrderStatusHeader
    },
    {
        path: 'orders/:oId/item/:iId/updateshippedinfo/:sId',
        component: UpdateShippedInfoComponent,
        data: updateArriveDateHeader
    },
    {
        path: 'company/:id',
        component: CompanyPurchaseOrderComponent,
        data: companyPurchaseOrder
    },
    {
        path: 'salesorder/company/:id',
        component: CompanySalesOrderComponent,
        data: companySalesOrder
    },
    {
        path: 'orders/:oId/item/:iId/newShipped',
        component: AddShippedComponent,
        data: newShippedOrderHeader
    },
    {
        path: 'orders/:oId/item/:iId/notes',
        loadChildren: 'app/components/business-notes/business-notes.module#BusinessNotesModule',
        data: businessSubjectListHeader
    },
    {
        path: 'orders/:oId/item/:iId/attachments',
        component: OrderAttachemntsComponent,
        data: orderJustShowAttachemntsHeader
    },
    {
        path: 'orders/new/share-order',
        component: ShareOrderComponent,
        data: addOrderContactHeader

    },
    {
        path: 'orders/:oId/share-order',
        component: ShareOrderComponent,
        data: addOrderContactHeader

    },
    {
        path: 'orders/share-order',
        component: ShareOrderComponent,
        data: addOrderContactHeader

    }


];
