import { first } from 'rxjs';
import { Licence } from '../../licence/models/licences';
export interface IUser {
    id:number,
    username:string,
    email:string,
    firstname:string,
    lastname:string,
    isActive:boolean,
    licences:Licence[] | null,
    roles:Role[],
}

export class User implements IUser {
    id:number;
    username:string;
    email:string;
    firstname:string;
    lastname:string;
    isActive:boolean;
    licences:Licence[] | null;
    roles:Role[];

    constructor(id:number, username:string, email:string, firstname:string, lastname:string, isActive:boolean = true, roles:Role[], licences:Licence[]|null = []){
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.isActive = isActive;
        this.licences = licences || [];
        this.roles = roles;
    }

    hasAuthority(role_name:any){
        for(const role of this.roles){
            if(RoleHierarchy[this._parseRole(role) as any] <= RoleHierarchy[role_name]){
                return true
            }
        }
        return false;
    }

    hasRole(role_name:string){
        for(const role of this.roles){
            if (role.name.split('_')[1] == role_name)
                return true
        }
        return false;
    }

    private _parseRole(role:Role){
        return role.name.split('_')[1]
    }
}

export enum RoleHierarchy{
    ADM = 1,
    PGM = 2,
    TEC = 3,
}

export interface Role {
    id:number,
    name:string,
}