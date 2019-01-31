import { Routes } from '@angular/router';
import { PeopleComponent } from './people.component';
import { PeopleProfileComponent } from 'app/containers/people/components/people-profile/people-profile.component';
import { peopleProfileHeader } from 'app/core/models/header';


export const PeopleRoutes: Routes = [
    {
        path: '',
        component: PeopleComponent,
        children: [
            {
                path: '',
                redirectTo: '/people/profile',
                pathMatch: 'full'
            },
            {
                path: 'profile/:id',
                component: PeopleProfileComponent,
                data: peopleProfileHeader
            }

        ]
    }
];
