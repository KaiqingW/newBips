import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'local' })
export class LocalTimePipe implements PipeTransform {
  transform(value: string, diff: number = 4) {
    const date = new Date(value.replace(' ', 'T'));
    return date.setHours(date.getHours() - diff);
  }
}
