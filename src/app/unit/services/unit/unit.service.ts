import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterService } from '../../../services/router/router.service';
import { Unit, Room } from '../../models/unit';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private base_url: string = `${environment.apiUrl}unit/`;

  constructor(private http: HttpClient, private router: RouterService) { 

  }

  get = () => {
    return this.http.get(this.base_url).pipe(
      map((data) => data as Unit[])
    )
  }

  getById = (id:string) => {
    return this.http.get(`${this.base_url}${id}`).pipe(
      map((data) => data as Unit)
    )
  }

  put = (unit:Unit) => {
    return this.http.put(`${this.base_url}${unit.id}`, unit, {}).pipe(
      map((data) => data as Unit)
    )
  }

  post(unit: Unit) {
    return this.http.post(`${this.base_url}`, unit).pipe(
      map((data) => data as Unit)
    )  
  }

  getRooms(){
    return this.http.get(`${environment.apiUrl}room`).pipe(
      map((data) => data as Room[])
    )
  }
}
