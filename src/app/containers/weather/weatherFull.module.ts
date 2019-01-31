import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherFullComponent } from './weatherFull.component';
import { WeatherService } from '../../core/services/weather.service';
import { RouterModule } from '@angular/router';
import { WeatherFullRoutes } from './weatherFull.router'; 
import { SpinnerModule } from 'app/components/spinner/spinner.module';

@NgModule({
  declarations: [
    WeatherFullComponent
  ],
  
  imports: [
    RouterModule.forChild(WeatherFullRoutes),    
    CommonModule,
    SpinnerModule,
  ],

  exports: [
    WeatherFullComponent
  ],

  providers: [
    WeatherService,
  ],

})

export class WeatherFullModule {

}