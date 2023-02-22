import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { map } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';
import { Order } from '../../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private base_url: string = `${environment.apiUrl}order/`;

  constructor(private http: HttpClient, private router: RouterService) { }
  
  get = () => {
    return this.http.get(this.base_url).pipe(
      map((data) => data as Order[])
    )
  }

  getById = (id:string) => {
    return this.http.get(`${this.base_url}${id}`).pipe(
      map((data) => data as Order)
    )
  }

  put = (order:Order) => {
    return this.http.put(`${this.base_url}${order.id}`, order, {}).pipe(
      map((data) => data as Order)
    )
  }

  post(order: Order) {
    return this.http.post(`${this.base_url}`, order).pipe(
      map((data) => data as Order)
    )  
  }
}
