import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyComponent } from "./company.component";
import { CompanySettingComponent } from "./containers/company-setting/company-setting.component";
import { editCompanyHeader, CompanyCategoryHeader, addEmployeeHeader, showcaseHeader, settingDashboardUpdateHeader,
         ProductCategoryHeader, companyInfoHeader, CompanyQuotesSettingHeader, ServiceCategoryHeader } from "../../core/models/header";
// import { ShowcaseComponent } from "app/containers/showcase/showcase.component";
import { AddEmployeeComponent } from 'app/containers/company/containers/add-employee/add-employee.component';
import { SettingDashboardComponent } from './containers/dashboard/dashboard.component';
import { ProdcutCategorySettingComponent } from './containers/product-category-setting/product-category-setting.component';
import { CompanyCategorySettingComponent } from './containers/company-category-setting/company-category-setting.component';
import { CompanyDetailComponent } from './containers/company-detail/company-detail.component';
import { CompanyQuoteSettingComponent } from './containers/company-quote-setting/company-quote-setting.component';
import { ServiceCategorySettingComponent } from './containers/service-category-setting/service-category-setting.component';

const companyRoutes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        children: [
            {
                path: '',
                redirectTo: '/company/:cid/company-setting',
                pathMatch: 'full'
            },
        ]
    },
    
    {
        path: ':cid/company-setting',
        component: SettingDashboardComponent,
        data: settingDashboardUpdateHeader
    },
    {
        path: ':cid/company-detail',
        component : CompanyDetailComponent,
        data: companyInfoHeader
    },
    {
        path: ':cid/company-setting/product-category',
        component: ProdcutCategorySettingComponent,
        data: ProductCategoryHeader
    },
    {
        path: ':cid/company-setting/service-category',
        component: ServiceCategorySettingComponent,
        data: ServiceCategoryHeader
    },
    {
        path: ':cid/company-setting/company-category',
        component: CompanyCategorySettingComponent,
        data: CompanyCategoryHeader
    },
    {
        path: ':cid/company-setting/company-info',
        component: CompanySettingComponent,
        data: editCompanyHeader
    },
    {
        path: ':cid/company-setting/quote',
        component: CompanyQuoteSettingComponent,
        data: CompanyQuotesSettingHeader
    },
    {
        path: ':cid/add-employee',
        component: AddEmployeeComponent,
        data: addEmployeeHeader
    },
    {
        path: ':cid/crm',
        loadChildren: 'app/containers/crm/crm.module#CrmModule',
    },
    {
        path: ':cid/vrm',
        loadChildren: 'app/containers/vrm/vrm.module#VrmModule',
    },
    {
        path: ':cid/hr',
        loadChildren: 'app/containers/hr/hr.module#HRModule',
    },
    {
        path: ':cid/dashboard',
        loadChildren: 'app/containers/dashboard/dashboard.module#DashboardModule',
    },
    {
        path: ':cid/purchase-order',
        loadChildren: 'app/containers/purchase-order/purchase-order.module#PurchaseOrderModule',
    },
    {
        path: ':cid/inventory',
        loadChildren: 'app/containers/inventory/inventory.module#InventoryModule',
    },
    {
        path: ':cid/warehouse',
        loadChildren: 'app/containers/warehouse/warehouse.module#WarehouseModule',
    },

    {
        path: ':cid/showcase',
        loadChildren: 'app/containers/showcase/showcase.module#ShowcaseModule',
    },
    {
        path: ':cid/orcamap',
        loadChildren: 'app/containers/business/orcamap/orcamap.module#OrcaMapModule',
    },
    {
        path: ':cid/appcenter',
        loadChildren: 'app/containers/business/appcenter/appcenter.module#AppCenterModule',
    },
    {
        path: ':cid/companyNotes',
        loadChildren: 'app/containers/notes/notes.module#NotesModule',
    },
    {
        path: ':cid/company-meeting',
        loadChildren: 'app/containers/meeting/meeting.module#MeetingModule',
    },
    {
        path: ':cid/business-meeting',
        loadChildren: 'app/containers/business-meeting/business-meeting.module#BusinessMeetingModule',
    },
    {
        path: ':cid/department-opportunity',
        loadChildren: 'app/containers/department-opportunity/department-opportunity.module#DepartmentOpportunityModule',
    },
    {
        path: ':cid/financial',
        loadChildren: 'app/containers/financial/financial.module#FinancialModule',
    },
    {
        path: ':cid/broadcast/:bctype',
        loadChildren: 'app/containers/business/broadcast/broadcast.module#BroadcastModule',
    },
    {
        path: ':cid/shop-management',
        loadChildren: 'app/containers/shop-management/shop-management.module#ShopManagementModule',
    },
    {
        path: ':cid/cost-analysis',
        loadChildren: 'app/containers/business/costanalysis/costanalysis.module#CostAnalysisModule',
    },
    {
        path: ':cid/opportunity',
        loadChildren: 'app/containers/business/opportunity/opportunity.module#OpportunityModule',
    },
    {
        path: ':cid/crm-assignment/:cstype',
        loadChildren: 'app/containers/business/crmassignment/assignment.module#CrmAssignmentModule',
    },
    {
        path: ':cid/salesentity',
        loadChildren:'app/components/business-quota/business-quota.module#BusinessQuotasModule',
    },

]

@NgModule({
    imports: [
        RouterModule.forChild(companyRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})

export class CompanyRoutingModule {

}
