import { Component } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'StockManager';

  constructor(private auth:AuthService){
    this.auth.init()
  }
}
