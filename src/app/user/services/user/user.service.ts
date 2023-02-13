import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { map } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';
import { User } from '../../models/user';

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
        for(let user of data as User[]){
            user.licences = null
        }
        return data as User[];
      })
    )
  }

  getById = (id:string) => {
    return this.http.get(`${this.base_url}${id}`).pipe(
      map((data) => data as User)
    )
  }

  put = (user:User) => {
    return this.http.put(`${this.base_url}${user.id}`, user, {}).pipe(
      map((data) => data as User)
    )
  }
}
