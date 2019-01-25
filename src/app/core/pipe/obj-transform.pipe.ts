import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objTransform'
})
export class ObjTransformPipe implements PipeTransform {

  transform(value: any, name?: any, type?: any): any {
    let result = '';
    if (value && value.indexOf('[') === 0) {
      result = JSON.parse(value).map(i => i.name).join(' ');
    } else if (value && value.indexOf('{') === 0) {
      result = JSON.parse(value)[name];
    }
    return result;
  }

}
