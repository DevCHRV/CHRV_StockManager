import { Licence } from '../../licence/models/licences';
import { Order } from '../../order/models/order';
import { ItemType } from '../../type/models/type';
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
    order:Order | null,
}