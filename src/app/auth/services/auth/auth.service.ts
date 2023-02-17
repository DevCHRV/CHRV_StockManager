import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { tap } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base_url: string = `${environment.apiUrl}auth/`;

  constructor(private http: HttpClient, private router: RouterService) {

  }

  login(props: FormData, redirectUrl?:string) {
    console.log(props.values)
    console.log(`${this.base_url}login`)
    return this.http.post(`${this.base_url}login`, props, {responseType:'text'}).pipe(
      tap(res=>{
        localStorage.setItem('token', `${res}`)
        redirectUrl && this.router.navigateTo(redirectUrl)
      }),
    )
  }


  logout(){
    localStorage.removeItem('token')
  }

  getId(){
    const token = localStorage.getItem('token')
    if(token){
      const value:any = jwtDecode(token)
      return `${value.id}`
    }
    return null
  }

  getUsername(){
    const token = localStorage.getItem('token')
    if(token){
      const value:any = jwtDecode(token)
      return `${value.firstname} ${value.lastname}`
    }
    return null
  }

  getFirstname(){
    const token = localStorage.getItem('token')
    if(token){
      const value:any = jwtDecode(token)
      return `${value.firstname}`
    }
    return null
  }

  getLastname(){
    const token = localStorage.getItem('token')
    if(token){
      const value:any = jwtDecode(token)
      return `${value.lastname}`
    }
    return null
  }

  getExpiration(){
    const token = localStorage.getItem('token')
    if(token){
      const value:any = jwtDecode(token)
      return `${value.exp}`
    }
    return null
  }

  isLoggedIn(){
    const token = localStorage.getItem('token')
    if(token){
      const value:any = jwtDecode(token)
      return (new Date().getTime()) < (value.exp*1000)
    }
    return false;
  }
}

//LDAP://chrv.be