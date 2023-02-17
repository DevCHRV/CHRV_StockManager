import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import axios from 'axios';
import { AuthService } from 'src/app/auth/services/auth/auth.service';
import { ToastService } from '../../../services/toast/toast.service';
import { RouterService } from '../../../services/router/router.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  is_opened:boolean

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public auth:AuthService, public toast:ToastService, private router:RouterService) {
    
  }

  toggle(){
    this.is_opened = !this.is_opened
  }

  //This is only to smoothen the dashboard button
  goToDashboard(){
    this.router.navigateTo('/')
  }

}
