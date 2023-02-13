import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { map } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';
import { ItemType } from '../../models/type';

@Injectable({
  providedIn: 'root'
})
export class ItemTypeService {
  private base_url: string = `${environment.apiUrl}item/type/`;

  constructor(private http: HttpClient, private router: RouterService) {

  }

  get = () => {
    return this.http.get(this.base_url).pipe(
      map((data) => data as ItemType[])
    )
  }

}
