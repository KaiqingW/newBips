import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'omitName' })
export class OmitNamePipe implements PipeTransform {
  transform(value: string, maxLength: string): string {
    if (value === null) {
        return value;
    }
    let exp = parseFloat(maxLength);
    exp = isNaN(exp) ? 50 : exp;
    return value.length <= exp ? value : value.substring(0, exp) + '   ...';
  }
}

@Pipe({
    name: 'omitNameImpure',
    pure: false
})
export class OmitNameImpurePipe extends OmitNamePipe {}
