import { Licence } from '../../licence/models/licences';
export interface Item {
    id:number,
    reference:string,
    serial_number:string,
    description:string,
    price:number,
    received_at?:Date,
    purchased_at?:Date,
    warranty_expires_at?:Date,
    type:ItemType,
    licence:Licence[],
    is_available:boolean,
    is_placed?:boolean,
    unit:string,
    room:string,
    last_checkup_at:Date,
    checkup_interval:number,
    provider:string
}

export interface ItemType {
    id:number,
    name:string,
    description:string,
    expected_lifetime:number,
    total_quantity:number,
    available_quantity:number,
}