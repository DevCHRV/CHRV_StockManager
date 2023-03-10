import { IUser } from '../../user/models/user';
import { Item } from '../../item/models/item';
import { Licence } from 'src/app/licence/models/licences';
import { Room } from '../../unit/models/unit';

export interface Intervention {
    id:number,
    ticketNumber:string,
    description:string,
    expectedDate:Date,
    actualDate?:Date,
    room:Room,
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