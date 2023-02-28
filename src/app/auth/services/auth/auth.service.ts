import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { map, tap } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { environment } from 'src/environments/environment';
import { IUser, User } from '../../../user/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private base_url: string = `${environment.apiUrl}auth/`;
  private user_url: string = `${environment.apiUrl}user/`;

  private user:User | null;

  constructor(private http: HttpClient, private router: RouterService) {

  }

  init(){
    const logged = localStorage.getItem("isLoggedIn")
    if(logged=="true"){
      this.fetchUser().subscribe(res=>{
        this.user = new User(res.id, res.username, res.firstname, res.lastname, res.roles, res.licences);
      })
    }
  }

  login(props: FormData, redirectUrl?:string) {
    return this.http.post(`${this.base_url}login`, props).pipe(
      map((data)=>data as IUser),
      tap(res=>{
        this.user = new User(res.id, res.username, res.firstname, res.lastname, res.roles, res.licences);
        localStorage.setItem("isLoggedIn", "true")
        redirectUrl && this.router.navigateTo(redirectUrl)
      }),
    )
  }


  logout(redirectUrl?:string){
    return this.http.post(`${this.base_url}logout`, null).pipe(
      tap(res=>{
        this.user=null
        localStorage.removeItem("isLoggedIn")
        redirectUrl && this.router.navigateTo(redirectUrl)
      }),
    )
  }

  hasRole(role_name:string){
    return this.user?.hasRole(role_name)
  }

  hasAuthority(authority_name:string){
    return this.user?.hasAuthority(authority_name)
  }

  getId(){
    if(this.user){
      return `${this.user.id}`
    }
    return null
  }

  getUsername(){
    if(this.user){
      return `${this.user.firstname} ${this.user.lastname}`
    }
    return null
  }

  getFirstname(){
    if(this.user){
      return `${this.user.firstname}`
    }
    return null
  }

  getLastname(){
    if(this.user){
      return `${this.user.lastname}`
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
    /*
    const token = localStorage.getItem('token')
    if(token){
      const value:any = jwtDecode(token)
      return (new Date().getTime()) < (value.exp*1000)
    }
    return false;
    */
    const logged = localStorage.getItem('isLoggedIn')
    if(logged){
      return logged=="true"
    } else  
      return this.user != null && this.user != undefined;
  }

  removeUser(){
    localStorage.removeItem("isLoggedIn")
    this.user=null
  }

  fetchUser(){
    return this.http.get(`${this.user_url}current`).pipe(
      map((data)=>data as IUser)
    )
  }
}

//LDAP://chrv.be