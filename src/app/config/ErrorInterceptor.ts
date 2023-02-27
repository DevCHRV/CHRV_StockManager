import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import { ToastService } from '../services/toast/toast.service';
import { AuthService } from '../auth/services/auth/auth.service';

@Injectable({providedIn:'any'})
export class ErrorInterceptor implements HttpInterceptor{

  constructor(private toast:ToastService, private auth:AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error:any)=>{
        if(error instanceof HttpErrorResponse){
          if(error.status == 401){
            this.auth.removeUser()
            this.toast.setError("La session a expiré, veuillez vous reconnecter.")
            return throwError(()=>new Error("La session a expiré, veuillez vous reconnecter."))
          }
          if(error.status == 400) {
            this.toast.setError(`Une erreur s'est produite pendant l'opération: ${error.error}`)
            return throwError(()=>error)
          }
          if(error.status == 403) {
            this.toast.setError(`Vous n'êtes pas autorisé à réaliser cette opération.`)
            return throwError(()=>error)
          }
          else {
            this.toast.setError("Une erreur s'est produite de notre côté.")
            return throwError(()=>error)        
          }
        }
        return throwError(()=>new Error(error))
      })
    )
  }
}