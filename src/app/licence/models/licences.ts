import { Item } from '../../item/models/item';
import { IUser } from '../../user/models/user';

export interface Licence {
    id:number,
    reference:string,
    description:string,
    value:string,
    purchasedAt:Date,
    user: IUser|null,
    type:LicenceType,
    item:Item|null,
}

export interface LicenceType {
    id:number,
    name:string,
}

export interface LicenceCreation {
    id:number,
    reference:string,
    description:string,
    value:string,
    purchasedAt:Date,
    quantity:number,
    type:LicenceType,
}