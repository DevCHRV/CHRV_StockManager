import { IUser } from '../../user/models/user';
import { Item } from '../../item/models/item';
import { Licence } from 'src/app/licence/models/licences';
export interface Intervention {
    id:number,
    ticketNumber:string,
    description:string,
    expectedDate:Date,
    actualDate?:Date,
    unit:string,
    room:string,
    user:IUser,
    notifier?:IUser,
    type:InterventionType,
    licences:Licence[],
    item:Item,
}

export interface InterventionType {
    id:number,
    name:string,
}