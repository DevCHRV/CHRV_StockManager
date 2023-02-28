import { Item } from '../../item/models/item';
import { IUser } from '../../user/models/user';

export interface Licence {
    id:number,
    description:string,
    value:string,
    user: IUser|null,
    type:LicenceType,
    item:Item|null,
}

export interface LicenceType {
    id:number,
    name:string,
}