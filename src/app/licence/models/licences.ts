import { Item } from '../../item/models/item';
import { User } from '../../user/models/user';

export interface Licence {
    id:number,
    description:string,
    value:string,
    user: User|null,
    type:LicenceType,
    item:Item|null,
}

export interface LicenceType {
    id:number,
    name:string,
}