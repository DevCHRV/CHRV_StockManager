import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { RouterService } from '../../../services/router/router.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit{

  is_focused = false
  @ViewChild('scanner') input:  ElementRef<HTMLInputElement>;

  constructor(private router:RouterService){

  }

  ngOnInit(){  }

  ngAfterViewInit(): void {
    while(!this.is_focused){
      this.focus()
    }
    this.input.nativeElement.focus()
  }

  focus(){
    this.input.nativeElement.focus()
    this.is_focused=true
  }

  navigate(event: any) {
    const regex = new RegExp('[0-9]*')
    const match = regex.test(`${event.target.value}`)
    if(match)
      this.router.navigateTo(`/item/${event.target.value}`)
  }
}
