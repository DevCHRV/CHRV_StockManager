import { Item } from '../../item/models/item';
export interface Room{
    id:number,
    name:string,
    unit:Unit,
    items?:Item,
}

export interface Unit {
    id:number,
    name:string,
    rooms:Room[],
}