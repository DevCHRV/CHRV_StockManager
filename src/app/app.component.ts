import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth/auth.service';
import { RouterService } from './services/router/router.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'StockManager';

  constructor(private auth:AuthService, private router:RouterService){
    this.auth.init()
  }
}
