import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn:'any'})
export class AuthInterceptor implements HttpInterceptor{
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')
    if(token != null){
      const clone = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`)
      })
      return next.handle(clone)
    } else return next.handle(req);
  }
}