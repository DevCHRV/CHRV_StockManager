import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { map } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';
import { Item } from '../../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private selectedItems:Item[] = []
  private base_url: string = `${environment.apiUrl}item/`;

  constructor(private http: HttpClient, private router: RouterService) {

  }

  get = () => {
    return this.http.get(this.base_url).pipe(
      map((data) => data as Item[])
    )
  }

  getById = (id:string) => {
    return this.http.get(`${this.base_url}${id}`).pipe(
      map((data) => data as Item)
    )
  }

  put = (item:Item) => {
    return this.http.put(`${this.base_url}${item.id}`, item, {}).pipe(
      map((data) => data as Item)
    )
  }

  post(item: Item) {
    return this.http.post(`${this.base_url}`, item).pipe(
      map((data) => data as Item)
    )  
  }

  pushSelected(item:Item){
    this.selectedItems.push(item)
  }

  removeSelected(item:Item){
    this.selectedItems = this.selectedItems.filter(i=>i.id != item.id)
  }

  getSelected(){
    return this.selectedItems
  }

  clearSelected(){
    this.selectedItems = []
  }
}
