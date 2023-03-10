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

    if(!properties || properties.length === 0){
      return values;
    }

    if(filter == 'true'){
      filter = true
    }

    if(filter == 'false'){
      filter = false
    }
    
    const data =values.filter((value:any)=>{
      return this._filter(value, properties, filter)
    })
    return data 
  }

  _filter(value: any, properties:string[], filter:any):any{
    if(properties.length>1)
      return value[properties[0]] ? this._filter(value[properties[0]], properties.slice(1, properties.length), filter) : false
    else{      
      //For some reason typescript can successfully compare: 1 == "1" but fails to compare true == "true" so we do additionnal checks
      if(typeof(filter)=='boolean'){
        //If the filter is a boolean, then we check if the target value is also a boolean
        //If the target value is not a boolean, and the filter is set to true we return true if the target value is NOT null and false if it is null
        if(typeof(value[properties[0]])!="boolean" && (value[properties[0]]!='true' || value[properties[0]]!='false')){
          return filter ? value[properties[0]] != null : value[properties[0]] == null
        }
        //If the target value is a boolean we simply compare them both
        else{
          return value[properties[0]] == filter
        }
      }
      //If the filter isn't a boolean we check for equality
      return value[properties[0]] != null ? `${value[properties[0]]}` == filter : false
    }
  }
}