import { SettingComponent } from './setting.component';
import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { profileUpdateHeader } from 'app/core/models/header';

export const SettingRoutes: Routes = [
    {
        path: '',
        component: SettingComponent,
        children: [
            {
                path: '',
                redirectTo: '/setting/profile',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                component: ProfileComponent,
                data: profileUpdateHeader
            }
        ]
    }
];
