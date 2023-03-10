import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { map } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';
import { IUser, Role } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private base_url: string = `${environment.apiUrl}user/`;

  constructor(private http: HttpClient, private router: RouterService) {

  }

  get = () => {
    return this.http.get(this.base_url).pipe(
      map((data) =>{
        for(let user of data as IUser[]){
            user.licences = null
        }
        return data as IUser[];
      })
    )
  }

  getLDAP = () => {
    return this.http.get(`${this.base_url}ldap`).pipe(
      map((data) =>{
        return data as IUser[];
      })
    )
  }

  getById = (id:string) => {
    return this.http.get(`${this.base_url}${id}`).pipe(
      map((data) => data! as IUser)
    )
  }

  put = (user:IUser) => {
    return this.http.put(`${this.base_url}${user.id}`, user, {}).pipe(
      map((data) => data as IUser)
    )
  }
  
  getRoles = () => {
    return this.http.get(`${environment.apiUrl}role/`).pipe(
      map((data) => data as Role[])
    )
  }
}
