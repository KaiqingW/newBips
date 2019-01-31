import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'local' })
export class LocalTimePipe implements PipeTransform {
  transform(value: string, diff: number = 0) {
    // if(window.screen.width > 800){
    //   diff = 4;
    // } 
    diff = 4;
    console.log('before ',value);
    const date = new Date(value.replace(' ', 'T'));
    console.log('after ',date)
    return date.setHours(date.getHours() - diff);
  }
}
