import { Licence } from '../../licence/models/licences';
import { Item } from '../../item/models/item';
import { IUser } from '../../user/models/user';
import { ItemType } from 'src/app/type/models/type';

export interface Order {
    id:number,
    user?:IUser,
    date?:Date,
    items:Item[],
    types:[{type:ItemType, quantity:number, items?:Item[]}],
    isReceived:boolean,
}