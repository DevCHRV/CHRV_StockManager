import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterService } from '../../../services/router/router.service';
import { map } from 'rxjs';
import { Intervention, InterventionType } from '../../models/intervention';
import { Item } from 'src/app/item/models/item';

@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  private base_url: string = `${environment.apiUrl}intervention/`;

  constructor(private http: HttpClient, private router: RouterService) { 

  }

  get = () => {
    return this.http.get(this.base_url).pipe(
      map((data) => data as Intervention[])
    )
  }

  getById = (id:string) => {
    return this.http.get(`${this.base_url}${id}`).pipe(
      map((data) => data as Intervention)
    )
  }

  getFor = (item:Item|string)=>{
    if(typeof(item)=="string"){
      return this.http.get(`${environment.apiUrl}item/${item}/intervention`).pipe(
        map((data) => data as Intervention[])
      )
    }
    else{
      return this.http.get(`${environment.apiUrl}item/${item.id}/intervention`).pipe(
        map((data) => data as Intervention[]))
      }
  }

  put = (intervention:Intervention) => {
    return this.http.put(`${this.base_url}${intervention.id}`, intervention, {}).pipe(
      map((data) => data as Intervention)
    )
  }

  post(intervention: Intervention) {
    return this.http.post(`${this.base_url}`, intervention).pipe(
      map((data) => data as Intervention)
    )  
  }

  getTypes(){
    return this.http.get(`${this.base_url}type`).pipe(
      map((data) => data as InterventionType[])
    )
  }

  generateTicket(intervention:Intervention){
    return this.http.put(`${this.base_url}${intervention.id}/ticket`, intervention).pipe(
      map((data) => data as string)
    )
  }
}
