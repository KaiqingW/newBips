import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent } from './news.component';
import { SafePipe} from './safe.pipe';
import { ShortPipeModule } from 'app/components/short-pipe/short.pipe.module';


@NgModule({
  declarations: [
    NewsComponent,
    SafePipe,
  ],
  
  imports: [
    CommonModule,
    ShortPipeModule,
  ],

  exports: [
    NewsComponent
  ]
})

export class NewsModule {

}