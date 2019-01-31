import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortObj' })
export class ShortObjPipe implements PipeTransform {
  transform(value: string, max: number) {
    
    if(!value || value.length == 0 || !max){
        return value;
    }

    if(value.length > max){
        return value.slice(0, max);
    } else {
        return value;
    }
  }
}
