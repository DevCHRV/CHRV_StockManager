import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import { catchError, Observable, throwError, tap } from 'rxjs';
import { ToastService } from '../services/toast/toast.service';

@Injectable({providedIn:'any'})
export class SuccessInterceptor implements HttpInterceptor{

  constructor(private toast:ToastService){}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((data)=>{
        if(data instanceof HttpResponse){
          //Do something
        }
      })
    )
  }
}