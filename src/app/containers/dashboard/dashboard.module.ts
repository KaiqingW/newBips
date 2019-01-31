import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from "./dashboard.component";
import { SalesDashboardComponent } from "./containers/sales-dashboard/sales-dashboard.component";
import { DashboardRoutingModule } from "./dashaboard-routing.module";
import { CompanyLogoModule } from "../crm/components/company-logo/company-logo.module";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PanelCardModule } from "../crm/components/panel-card/panel-card.module";
import { LogoModule } from 'app/components/logo/logo.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';

import { MatButtonModule } from '@angular/material/button';
import { NewsModule } from "app/components/news/news.module";
import { WeatherModule } from "app/components/weather/weather.module";
import { SidebarComponent } from './containers/sidebar/sidebar.component';

import { BusinessMeetingService } from '../../core/services/business-meeting.service';
import { OrdersService } from '../../core/services/orders.service';
import { DialogService } from 'app/core/services/dialog.service';
import { DepartmentOpportunityService } from 'app/core/services/department-opportunity.service';
import { DashBoardService } from 'app/core/services/dashboard.service';
// import { CommonImageCropperModule } from 'app/components/image-cropper/image-cropper.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DashboardRoutingModule,
        CompanyLogoModule,
        MatCardModule,
        MatIconModule,
        PanelCardModule,
        LogoModule,
        SpinnerModule,
        MatButtonModule,
        NewsModule,
        WeatherModule,
        // CommonImageCropperModule
    ],

    declarations: [
        SalesDashboardComponent,
        SidebarComponent,
        DashboardComponent
    ],
    providers: [
        BusinessMeetingService,
        OrdersService,
        DialogService,
        DepartmentOpportunityService,
        DashBoardService
    ]
})

export class DashboardModule {

}