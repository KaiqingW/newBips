import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { InviteUserComponent } from './invite-user.component';
import { ProfilePictureModule } from 'app/components/profile-picture/profile-picture.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SpinnerModule,
        ProfilePictureModule,
        
        MatCardModule,
        MatInputModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatIconModule,
        MatButtonModule
    ],
    declarations:[
        InviteUserComponent
    ],
    exports:[
        InviteUserComponent
    ],
    providers:[

    ]
})

export class InviteUserModule{
    
}
