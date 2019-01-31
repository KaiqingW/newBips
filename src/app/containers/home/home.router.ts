import { HomeComponent } from './home.component';
import { Routes } from '@angular/router';
import { homeHeader,createCompanyHeader, showBusinessHeader, fileboxHeader,  searchCompanyHeader,createProcessHeader } from 'app/core/models/header';

import { InputCompanyNameComponent } from './components/input-company-name/input-company-name.component';
import { SearchCompanyComponent } from './components/search-company/search-company.component';
import { CreateJoinCompanyComponent } from './components/create-join-company/create-join-company.component';
import { CreateCompanyComponent } from './components/create-company/create-company.component';
import { BusinessPanelComponent } from './components/business-panel/business-panel.component';
import { FileBoxComponent } from '../../components/file-box/file-box.component';


export const HomeRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        // data : homeHeader,
    },
    {
        path: 'create-company-stepone',
        component: InputCompanyNameComponent,
        data : createProcessHeader
    },
    {
        path:'create-join-company',
        component: CreateJoinCompanyComponent,
        data : createProcessHeader
    },
    
    {
        path: 'create-company',
        component: CreateCompanyComponent,
        data : createCompanyHeader
    },
    {
        path:'search-company',
        component : SearchCompanyComponent,
        data : searchCompanyHeader
    },
    {
        path: 'show-company',
        component: BusinessPanelComponent,
        // data : showBusinessHeader,
    },
    {
        path: 'filebox',
        component: FileBoxComponent,
        data : fileboxHeader,
    },
    // {
    //     path: 'personal-meeting',
    //     loadChildren: 'app/containers/meeting/meeting.module#MeetingModule'
    // }
    
];
