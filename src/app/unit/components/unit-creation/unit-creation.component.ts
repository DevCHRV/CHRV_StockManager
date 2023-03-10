import { Component } from '@angular/core';
import { Room, Unit } from '../../models/unit';
import { ToastService } from '../../../services/toast/toast.service';
import { UnitService } from '../../services/unit/unit.service';
import { RouterService } from '../../../services/router/router.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-unit-creation',
  templateUrl: './unit-creation.component.html',
  styleUrls: ['./unit-creation.component.scss']
})
export class UnitCreationComponent {
  public unit:Unit = {
    name:'',
    rooms: [],
  } as unknown as Unit;
  public unitRooms:Room[] = [];
  public rooms:Room[];
  public room = new FormControl<string>('');
  public form:FormGroup
  constructor(private toast:ToastService, private service:UnitService, private router:RouterService, private builder:FormBuilder){
    this.form = builder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
    })
  }

  ngOnInit(){

  }

  post(){
    this.service.post(this.unit).pipe(
      catchError(res=>{
        return of(null)
      })
    ).subscribe(
      res=>this.router.navigateTo(`unit/${res?.id}`)
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
