import { Component, Input } from '@angular/core';
import * as fromAuthReduer from 'app/core/reducers/auth.reducer';

@Component({
    selector: 'user-page',
    templateUrl: 'user-page.component.html',
    styleUrls: ['user-page.component.scss']
})

export class UserPageComponent {
    showBusiness = false;
    @Input() auth: fromAuthReduer.State;
 }