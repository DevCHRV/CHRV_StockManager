import { Licence } from '../../licence/models/licences';
import { Item } from '../../item/models/item';
import { IUser } from '../../user/models/user';
import { ItemType } from 'src/app/type/models/type';

export interface Order {
    id:number,
    user?:IUser,
    date?:Date,
    items:Item[],
    types:{type:ItemType, quantity:number, items?:Item[], price?:number}[],
    isReceived:boolean,
}

export interface OrderCreation {
    date?:Date,
    items:OrderItem[],
    types:OrderType[],
}

export interface OrderType {
    id:number,
    alias:string,
    name:string,
    description:string,
    items?:OrderItem[],
}

export interface OrderItem {
    description:string,
    price:number,
    purchasedAt?:Date,
    warrantyExpiresAt?:Date,
    type:ItemType,
    lastCheckupAt:Date,
    checkupInterval:number,
    provider:string,
    quantity:number,
}