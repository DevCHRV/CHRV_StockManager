import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../../item/models/item';
import { filter } from 'rxjs';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(values: any[], filter: any | null, properties:string[]): any[] {

    if(filter==null || `${filter}`=='null'){
      return values;
    }
    if (!filter || filter === 0) {
      return values;
    }

    if (values.length === 0) {
      return values;
    }

    if(!properties || properties.length === 0)
      return values;

    return values.filter((value:any)=>{
      return this._filter(value, properties, filter)
    })
  }

  _filter(value: any, properties:string[], filter:any):any{
    if(properties.length>1)
      return value[properties[0]] ? this._filter(value[properties[0]], properties.slice(1, properties.length), filter) : false
    else
      return value[properties[0]] ? value[properties[0]]==filter : false
  }
}