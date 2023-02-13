import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router:Router) {
    
  }

  public navigateTo = (uri:string) => {
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.router.navigate([uri]);
    });
  }
}
