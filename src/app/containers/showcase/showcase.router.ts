import { ShowcaseComponent } from './showcase.component';
import { ShowcaseListComponent } from './showcase-list/showcase-list.component';
import { ShowcaseAddComponent } from './showcase-add/showcase-add.component';
import { Routes } from '@angular/router';
import { showcaseHeader, showcaseListHeader, addShowcaseHeader } from 'app/core/models/header';

export const ShowcaseRoutes: Routes = [
    {
        path: '',
        component: ShowcaseComponent,
        data: showcaseHeader
    },
    {
        path: 'showcaseList',
        component: ShowcaseListComponent,
        data: showcaseListHeader
    },
    {
        path: 'showcaseList/addShowcase',
        component: ShowcaseAddComponent,
        data: addShowcaseHeader
    },
];
