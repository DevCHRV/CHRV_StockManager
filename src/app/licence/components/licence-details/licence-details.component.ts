import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, Observable } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { FormControl } from '@angular/forms';
import { Licence } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';
import { User } from '../../../user/models/user';
import { UserService } from '../../../user/services/user/user.service';
import { LicenceType } from '../../models/licences';
import { LicenceTypeService } from '../../services/type/type.service';
import { Item } from '../../../item/models/item';

@Component({
  selector: 'app-licence-details',
  templateUrl: './licence-details.component.html',
  styleUrls: ['./licence-details.component.scss']
})
export class LicenceDetailsComponent {
  
  public licence:Licence;
  public users:User[];
  public types:LicenceType[] = [];
  public is_locked:boolean = true;
  filteredUserOptions:Observable<User[]>;
  searchUserSelect = new FormControl<string>('---');

  constructor(private service:LicenceService, private userService:UserService, private licenceTypeService:LicenceTypeService, private router:RouterService, private route:ActivatedRoute){
    this.getLicence()
  }

  ngOnInit(){
    this.filterOptions()
  }

  addUser(){
    const userValue = this.searchUserSelect.value
    if(typeof(userValue)=="string")
      return
    const user = this.users.find(u=>u.id==userValue)
    this.licence.user = user ? user : null
    this.resetInputs()
  }

  resetInputs(){
    this.searchUserSelect.setValue('---')
  }

  removeUser(id:number){

  }

  toggleLock(){
    this.is_locked = !this.is_locked
    this.getLicence()
  }

  getLicence(){
    this.service.getById(this.route.snapshot.paramMap.get('id')!).subscribe(
      res=>{
      this.licence = res
      }
    )
    this.userService.get().subscribe(
      res => {
        this.users = res
        this.licenceTypeService.get().subscribe(
          res => {
            this.types = res
          }
        )
      }
    )
  }

  put(){
    this.addUser()
    this.service.put(this.licence).subscribe(
      res => {
        this.is_locked=true
        this.getLicence()
      }
    )
  }

  getUserDisplay(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? `${tmp.username}`: ''
  }

  filterOptions(){
    this.filterUserOptions()
  }

  filterUserOptions(){
    this.filteredUserOptions = this.searchUserSelect.valueChanges.pipe(
      startWith(''),
      map(value =>this._filterUser(value!||-1)))
  }

  private _filterUser(value: number|string): User[] {
    return typeof(value)=="string" ? this._doFilterUserString(`${value}`)
      :this._doFilterUserInt(value)
  }

  private _doFilterUserInt(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? this.users.filter(u=>u.id==tmp.id):this.users
  }

  private _doFilterUserString(input:string){
    return this.users.filter(u=>`${u.username}${u.firstname}${u.lastname}`.toLowerCase().includes(input))
  }
}
