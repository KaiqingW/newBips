import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    CalendarComponent
  ]
})

export class CalendarModule {

}
