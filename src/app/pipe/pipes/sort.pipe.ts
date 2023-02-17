import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../../item/models/item';

@Pipe({ name: 'sort' })
export class SortPipe implements PipeTransform {
  transform(values: any[], isAsc:boolean | null = true, property:string = ''): Item[] {

    if(!values || property=='')
        return values

    if(values.length<1)
        return values

    return values.sort((a: any, b:any) => {
        switch (typeof(a[property])){
        case 'number': return this._compare(+a[property], +b[property], isAsc!);
        case 'string': return this._compare(a[property], b[property], isAsc!);
        default: return 0;
        }
    });
  }
  
  _compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}