import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showMore' })
export class ShowMorePipe implements PipeTransform {
  transform(value: any, max: number) {
    if(value == null || value.length === 0 || value.length <= max){
      return value;
    } else {
      return value.slice(0, max);
    }
  }
}
