import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HrRoutingModule } from './hr-routing.module';
import { HRComponent } from './hr.component';
import { EmployeeComponent } from './containers/employee/employee.component';
import { CandidateComponent } from './containers/candidate/candidate.component';
import { ResumeComponent } from './containers/resume/resume.component';
import { HumanDetailsModule } from './components/human-details/human-details.module';
import { AddHumanComponent } from './containers/add-human/add-human.component';
import { HumanCardModule } from './components/human-card/human-card.module';

import { AddButtonModule } from 'app/components/add-button/add-button.module';
import { SpinnerModule } from 'app/components/spinner/spinner.module';
import { ImageCropperModule } from 'ng2-img-cropper';
import { CropModalModule } from 'app/components/crop-modal/crop-modal.module';

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
        HrRoutingModule,
        HumanDetailsModule,
        HumanCardModule,
        AddButtonModule,
        SpinnerModule,
        ImageCropperModule,
        CropModalModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatAutocompleteModule,
        MatTabsModule,
        MatChipsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    declarations:[
        HRComponent,
        EmployeeComponent,
        AddHumanComponent,
        CandidateComponent,
        ResumeComponent
    ],
    providers:[

    ],
    exports:[
        HRComponent
    ]
})

export class HRModule{
    
}