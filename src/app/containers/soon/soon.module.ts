import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoonComponent } from './soon.component';
import { RouterModule } from '@angular/router';
import { SoonRoutes } from './soon.router'; 

@NgModule({
  declarations: [
    SoonComponent
  ],
  
  imports: [
    RouterModule.forChild(SoonRoutes),    
    CommonModule,
  ],

  exports: [
    SoonComponent
  ],

  providers: [
  ],

})

export class SoonModule {

}