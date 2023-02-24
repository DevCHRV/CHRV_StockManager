import { Licence } from '../../licence/models/licences';
import { Item } from '../../item/models/item';
import { User } from '../../user/models/user';
import { ItemType } from 'src/app/type/models/type';

export interface Order {
    id:number,
    user?:User,
    date?:Date,
    items:Item[],
    types:[{type:ItemType, quantity:number, items?:Item[]}],
    isReceived:boolean,
}