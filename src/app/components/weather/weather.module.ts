import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherComponent } from './weather.component';
import { WeatherService } from '../../core/services/weather.service';

@NgModule({
  declarations: [
    WeatherComponent
  ],
  
  imports: [
    CommonModule,
  ],

  exports: [
    WeatherComponent
  ],

  providers: [
    WeatherService,
  ],

})

export class WeatherModule {

}