import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/services/auth/auth.service';
import { RouterService } from '../../services/router/router.service';
import { ToastService } from '../../services/toast/toast.service';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private auth:AuthService, private router:RouterService, private toast:ToastService){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.auth.hasAuthority('ADM'))
      return true

    this.router.navigateBack()
    this.toast.setError("Vous n'êtes pas autorisé à accéder à cette page.")
    return false;
  }
}
