import { Routes } from '@angular/router';
// import { AuthGuard } from 'app/core/services/auth-guard.service';

export const AppRoutes: Routes = [
    {
        path: '',
        loadChildren: 'app/containers/home/home.module#HomeModule'
    },
    {
        path: 'home',
        loadChildren: 'app/containers/home/home.module#HomeModule'
    },
    {
        path: 'notes',
        loadChildren: 'app/containers/notes/notes.module#NotesModule'
    },
    {
        path: 'personal-meeting',
        loadChildren: 'app/containers/meeting/meeting.module#MeetingModule'
    },
    {
        path: 'confirm',
        loadChildren: 'app/containers/guest-confirm/guest-confirm.module#GuestConfirmModule',
    },
    {
        path: 'auth',
        loadChildren: 'app/containers/auth/auth.module#AuthModule',
    },
    {
        path: 'contacts',
        loadChildren: 'app/containers/contact/contacts.module#ContactsModule',
    },
    {
        path: 'expo',
        loadChildren: 'app/containers/expo/expo.module#ExpoModule'
    },
    {
        path: 'weather',
        loadChildren: 'app/containers/weather/weatherFull.module#WeatherFullModule'
    },
    {
        path: 'shop',
        runGuardsAndResolvers: 'always',
        loadChildren: 'app/containers/shop/shop.module#ShopModule'
    },
    {
        path: 'shop-order',
        loadChildren: 'app/containers/shop-order/shop-order.module#ShopOrderModule'
    },
    {
        path: 'setting',
        loadChildren: 'app/containers/setting/setting.module#SettingModule'
    },
    {
        path: 'people',
        loadChildren: 'app/containers/people/people.module#PeopleModule'
    },
    {
        path: 'soon',
        loadChildren: 'app/containers/soon/soon.module#SoonModule'
    },

    // add inventory router link to app, editted by yali, 2/28/2018
    // also add InventoryModule to app.module using router
    // {
    //     path: 'inventory',
    //     loadChildren: 'app/containers/inventory/inventory.module#InventoryModule'
    // },
    // end

    // add purchase-order router link to app, editted by Lisa, 3/8/2018
    // also add PurchaseOrderModule to app.module using router
    // {
    //     path: 'purchase-order',
    //     loadChildren: 'app/containers/purchase-order/purchase-order.module#PurchaseOrderModule'
    // },
    //end

    //don't delete or comment this dashboard
    {
        path: 'dashboard',
        // canActivate:[AuthGuard],
        loadChildren: 'app/containers/dashboard/dashboard.module#DashboardModule'
    },
    {
        path:'company',
        loadChildren: 'app/containers/company/company.module#CompanyModule'
    },
    // if do not find the matched router link, go to the default home page
    {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
    }
    // end
   
  ];
