import { Licence } from '../../licence/models/licences';
import { Order } from '../../order/models/order';
import { ItemType } from '../../type/models/type';
import { Intervention } from '../../intervention/models/intervention';
import { Room } from '../../unit/models/unit';
export interface Item {
    id:number,
    name:string,
    reference:string,
    serialNumber:string,
    description:string,
    price:number,
    receivedAt?:Date,
    purchasedAt?:Date,
    warrantyExpiresAt?:Date,
    type:ItemType,
    licence:Licence[],
    interventions:Intervention[],
    isAvailable:boolean,
    isPlaced?:boolean,
    unit:string,
    room:Room,
    lastCheckupAt:Date,
    checkupInterval:number,
    provider:string
    order:Order | null,
}