import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../../item/models/item';
import { filter } from 'rxjs';

@Pipe({ name: 'search' })
export class SearchPipe implements PipeTransform {
  transform(values: any[], input:string): any[] {
    if(input==null || `${input}`=='null'){
      return values;
    }
    if (!input || input === '0' || input === '') {
      return values;
    }

    if(!values)
      return values

    if (values.length === 0) {
      return values;
    }

    return values.filter((value:any)=>{
      return this._filter(value, '', Object.keys(value), input)
    })
  }

  _filter(value: any, current:string, keys:any[], input:string):any{
    return JSON.stringify(value).toLowerCase().indexOf(input.toLowerCase())!=-1
  }

  /*
  _filter(value: any, current:string, keys:any[], input:string):any{
    if(keys.length>1){
      if((typeof(value[keys[0]])!='string' && typeof(value[keys[0]])!='number') || new RegExp('[0-9]{4}(/|-)[0-9]{2}(/|-)[0-9]{2}$').test(value[keys[0]])){
        return this._filter(value, `${current}`, keys.slice(1, keys.length), input)
      }
      return this._filter(value, `${current}${value[keys[0]]}`, keys.slice(1, keys.length), input)
    }
    if((typeof(value[keys[0]])!='string' && typeof(value[keys[0]])!='number') || new RegExp('[0-9]{4}(/|-)[0-9]{2}(/|-)[0-9]{2}$').test(value[keys[0]])){
      return `${current}`.toLowerCase().indexOf(input.toLowerCase())!=-1
    }
    return `${current}${value[keys[0]]}`.toLowerCase().indexOf(input.toLowerCase())!=-1
  }
  */
}