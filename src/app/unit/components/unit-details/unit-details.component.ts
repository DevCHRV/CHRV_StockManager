import { Component } from '@angular/core';
import { ToastService } from '../../../services/toast/toast.service';
import { UnitService } from '../../services/unit/unit.service';
import { RouterService } from '../../../services/router/router.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { Room, Unit } from '../../models/unit';

@Component({
  selector: 'app-unit-details',
  templateUrl: './unit-details.component.html',
  styleUrls: ['./unit-details.component.scss']
})
export class UnitDetailsComponent {
  public unit:Unit;
  public unitRooms:Room[] = [];
  public rooms:Room[];

  public room = new FormControl<string>('');

  public is_locked:boolean = true

  constructor(private toast:ToastService, private service:UnitService, private router:RouterService, private builder:FormBuilder, private route:ActivatedRoute){

  }

  ngOnInit(){
    this.load()
  }

  put(){
    this.service.put(this.unit).pipe(
      catchError(res=>{
        this.load()
        return of(null)
      })
    ).subscribe(
      res => {
        this.is_locked = true
        this.toast.setSuccess()
      }
    )
  }

  toggleLock(){
    this.is_locked = !this.is_locked
  }

  load(){
    this.service.getById(this.route.snapshot.paramMap.get('unit_id')!).subscribe(
      res => {
        this.unit = res
      }
    )
  }

  addRoom(){
    const roomValue = this.room.value
    if(typeof(roomValue)!="string")
      return
      
    if(roomValue == "")
      return

    roomValue && this.unit.rooms.push({name: roomValue} as Room)
    this._resetInputs()
  }

  removeRoom(room:Room){
    this.unit.rooms = this.unit.rooms.filter(r=>r.name != room.name)
  }

    
  private _resetInputs(){
    this.room.setValue('')
  }
}
