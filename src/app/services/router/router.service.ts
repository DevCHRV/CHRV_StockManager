import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router:Router, private location:Location) {
    
  }

  public navigateTo = (uri:string) => {
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.router.navigate([uri]);
    });
  }

  public navigateBack(){
    this.location.back()
  }
}
