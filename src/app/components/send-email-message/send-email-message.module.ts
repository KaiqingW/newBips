import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { SendEmailMessageComponent } from './send-email-message.component';
import { EditEmailMessageComponent } from './edit-email-message/edit-email-message.component';

@NgModule({
  declarations: [
    SendEmailMessageComponent,
    EditEmailMessageComponent
    
  ],
  imports: [
    CommonModule,
    MatIconModule,

  ],
  exports: [
    SendEmailMessageComponent
  ]
})

export class SendEmailMessageModule {

}
