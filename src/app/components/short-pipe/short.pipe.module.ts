import { NgModule } from '@angular/core';
import { ShortTextPipe } from './short.pipe';
import { ShortObjPipe } from './short-obj.pipe';

@NgModule({
  declarations: [
    ShortTextPipe,
    ShortObjPipe
  ],
  imports: [
  ],
  exports: [
    ShortTextPipe,
    ShortObjPipe
  ]
})

export class ShortPipeModule {

}
