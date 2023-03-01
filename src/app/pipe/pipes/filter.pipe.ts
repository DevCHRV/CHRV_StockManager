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

    const data =values.filter((value:any)=>{
      return this._filter(value, properties, filter)
    })
    return data 
  }

  _filter(value: any, properties:string[], filter:any):any{
    if(properties.length>1)
      return value[properties[0]] ? this._filter(value[properties[0]], properties.slice(1, properties.length), filter) : false
    else{
      //For some reason typescript can successfully compare: 1 == "1" but fails to compare true == "true" so we parse the value as a string to allow filtering by booleans
      //Also we need to explicitly check for null instead of just doing 'value ? something : else' because in the case of a boolean, it would always return 'else'
      return value[properties[0]] != null ? `${value[properties[0]]}` == filter : false
    }
  }
}