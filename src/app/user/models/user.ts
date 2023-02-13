import { Licence } from '../../licence/models/licences';
export interface User {
    id:number,
    username:string,
    firstname:string,
    lastname:string,
    licences:Licence[] | null,
    roles:Role[],
}

export interface Role {
    id:number,
    name:string,
}