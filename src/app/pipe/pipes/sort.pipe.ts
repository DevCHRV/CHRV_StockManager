import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sort' })
/**
 * This pipe can sort most types. Currently support Boolean, Number, String and Object
 * This pipe CANNOT sort object if the objectIdProperty is not configured correctly
 * Default objectIdProperty value is 'id'
 */
export class SortPipe implements PipeTransform {
  transform(values: any[], isAsc:boolean | null = true, property:string = '', objectIdProperty:string = 'id'): any[] {
    if(!values || property=='')
        return values

    if(values.length<1)
        return values

    return values.sort((a: any, b:any) => {
        switch (typeof(a[property])){
        case 'boolean': return this._compare(+a[property], +b[property], isAsc!);
        case 'number': return this._compare(+a[property], +b[property], isAsc!);
        case 'string': return this._compare(a[property], b[property], isAsc!);
        case 'object': return this._compareObj(a[property], b[property], isAsc!, objectIdProperty);
        default: return 0;
        }
    });
  }
  
  _compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  _compareObj(a:any, b:any, isAsc:boolean, id:string): number{
    if(a == null || a as any == "null")
      return -1 * (isAsc ? 1 : -1)
    if(b == null || b as any == "null")
      return 1 * (isAsc ? 1 : -1)
    if(a != null && a as any != "null" && b != null && b as any != "null"){
      return this._compare(a[id], b[id], isAsc)
    }
    return 0
  }
}