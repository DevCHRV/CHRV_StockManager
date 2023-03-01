import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, tap } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import axios from 'axios';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { Toast, ToastService } from '../../../services/toast/toast.service';
import { RouterService } from '../../../services/router/router.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { opacity } from 'html2canvas/dist/types/css/property-descriptors/opacity';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('shown',  style({display:'block', opacity:1})),
      state('hidden', style({display:'none', opacity:0})),
      transition('hidden => shown', [
        animate('1s')
        //animate('1s 300ms ease-in', style({display:'block', opacity:1}))
      ]),
      transition('shown => hidden', [
        animate('1s')
        //animate('1s 300ms ease-out', style({display:'none', opacity:0}))
      ]),
    ])
  ],
})
export class HeaderComponent {

  toasts:Toast[] = []
  is_opened:boolean

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public auth:AuthService, public toast:ToastService, private router:RouterService) {
    toast.toast().subscribe(
      res => {
        this.toasts = [...this.toasts, ...res]
        setTimeout(()=>{
          this.toasts.shift()
        }, 8000)
      }
    )
  }

  toggle(){
    this.is_opened = !this.is_opened
  }

  //This is only to smoothen the buttons and allow us to modify urls for both the burger menu and the toolbar at the same time
  goToLogout(){
    this.auth.logout().subscribe(res=>{
      this.toast.setSuccess("Déconnexion réussie !")
    })
    this.goToLogin()
  }

  goToLogin(){
    this.router.navigateTo('login')
  }

  goToUser(){
    this.router.navigateTo('user')
  }

  goToDashboard(){
    this.router.navigateTo('/')
  }

  goToItem(){
    this.router.navigateTo('item')
  }

  goToLicence(){
    this.router.navigateTo('licence')
  }

  goToIntervention(){
    this.router.navigateTo('intervention')
  }

  goToOrder(){
    this.router.navigateTo('order')
  }

}
