import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  private history: string[] = [];

  constructor(private router:Router, private location:Location) {
    
  }

  public navigateTo = (uri:string) => {
    this.router.navigateByUrl('/', {skipLocationChange: false}).then(() => {
      this.history.push(uri)
      this.router.navigate([uri]);
    });
  }

  public navigateBack(){
    this.router.navigate([this.history.pop()||''])
  }
}
