import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'StockManager';

  constructor(){
    axios.interceptors.request.use((config)=>{
      const token = localStorage.getItem('token') || null
      if(token!=null){
        config.headers.set("Authorization",`Bearer ${token}`)
      }
      return config
    })
  }
}
