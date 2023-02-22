import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private is_loading : boolean = false

  constructor() { }

  setLoading(is:boolean){
    this.is_loading = is
  }

  isLoading(){
    return this.is_loading
  }
}
