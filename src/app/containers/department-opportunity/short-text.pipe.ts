import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'short' })
export class ShortTextPipe implements PipeTransform {
  transform(value: string, max: number = 10) {
    
    if(!value || value.length == 0){
        return value;
    }

    if(value.length > max){
        return value.substr(0, max) + '..';
    } else {
        return value;
    }
  }
}
