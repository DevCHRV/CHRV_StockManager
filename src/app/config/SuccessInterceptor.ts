import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import { catchError, Observable, throwError, tap } from 'rxjs';
import {finalize} from 'rxjs/operators'
import { ToastService } from '../services/toast/toast.service';
import { LoaderService } from '../services/loader/loader.service';

@Injectable({providedIn:'any'})
export class SuccessInterceptor implements HttpInterceptor{

  constructor(private toast:ToastService, private loader:LoaderService){}
  
  private requestStackSize = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requestStackSize++
    this.loader.setLoading(true)

    return next.handle(req).pipe(
      tap((data)=>{
        if(data instanceof HttpResponse){
          //Do something
        }
      }),
      finalize(()=>{
        this.requestStackSize--
        if(this.requestStackSize == 0){
          this.loader.setLoading(false)
        }
      })
    )
  }
}