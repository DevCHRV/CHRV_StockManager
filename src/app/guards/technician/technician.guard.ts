import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../auth/services/auth/auth.service';
import { RouterService } from '../../services/router/router.service';
import { ToastService } from '../../services/toast/toast.service';


@Injectable({
  providedIn: 'root'
})
export class TechnicianGuard implements CanActivate {

  constructor(private auth:AuthService, private router:RouterService, private toast:ToastService){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //No need to subscribe to the observable as Angular will internally subscribe to it
    //We just need to make sure we map the observable as a boolean and do what we want in the process
    return this.auth.hasAuthorityAsync('TEC').pipe(
      map((data)=>{
        if(data){
          return true
        } else{
          this.router.navigateBack()
          this.toast.setError("Vous n'êtes pas autorisé à accéder à cette page.")
          return false;
        }
      }),
    )
  }
}
