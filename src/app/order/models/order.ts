import { Licence } from '../../licence/models/licences';
import { Item, ItemType } from '../../item/models/item';
import { User } from '../../user/models/user';

export interface Order {
    id:number,
    user?:User,
    date?:Date,
    items:Item[],
    types:[{type:ItemType, quantity:number, items?:Item[]}],
    isReceived:boolean,
}