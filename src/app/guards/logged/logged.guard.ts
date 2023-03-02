import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../auth/services/auth/auth.service';
import { RouterService } from '../../services/router/router.service';
import { ToastService } from '../../services/toast/toast.service';


@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(private auth:AuthService, private router:RouterService, private toast:ToastService){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isLoggedInAsync().pipe(
      map((res) => {
        if(res==true){
          return true;
        }else{
          this.router.navigateTo("/login")
          this.toast.setError("Vous n'êtes pas autorisé à accéder à cette page.")
          return false;
        }
      })
    )
  }
}
