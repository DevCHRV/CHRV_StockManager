import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { map } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';
import { Licence, LicenceType } from '../../models/licences';

@Injectable({
  providedIn: 'root'
})
export class LicenceTypeService {
  private base_url: string = `${environment.apiUrl}licence/type/`;

  constructor(private http: HttpClient, private router: RouterService) {

  }

  get = () => {
    return this.http.get(this.base_url).pipe(
      map((data) => data as LicenceType[]))
  }

  getById = (id:string) => {
    return this.http.get(`${this.base_url}${id}`).pipe(
      map((data) => data as LicenceType)
    )
  }

  put = (licence:Licence) => {
    return this.http.put(`${this.base_url}${licence.id}`, licence).pipe(
      map((data) => data as LicenceType)
    )
  }
}
