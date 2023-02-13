import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, Observable, of, filter } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { ItemType } from 'src/app/type/models/type';
import { ItemTypeService } from 'src/app/type/services/type/type.service';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item/item.service';
import { FormControl } from '@angular/forms';
import { Licence } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';
import { User } from '../../../user/models/user';
import { UserService } from '../../../user/services/user/user.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent {
  
  public item:Item;
  public itemLicences:Licence[];
  public types:ItemType[];
  public licences:Licence[];
  public users:User[];
  public is_locked:boolean = true;
  public filteredLicenceOptions:Observable<Licence[]>;
  public filteredUserOptions:Observable<User[]>;
  public searchLicenceSelect = new FormControl<string>('---');
  public searchUserSelect = new FormControl<string>('---');

  constructor(private service:ItemService, private typeService:ItemTypeService, private licenceService:LicenceService, private userService:UserService, private router:RouterService, private route:ActivatedRoute){
    this.getItem()
  }

  ngOnInit(){
    this.filterOptions()
  }

  addLicence(){
    const licenceValue = this.searchLicenceSelect.value
    if(typeof(licenceValue)=="string")
      return
    const userValue = this.searchUserSelect.value
    if(typeof(userValue)=="string"&&!userValue)
      return
    const licence = this.licences.find(l=>l.id==licenceValue)
    //Little trick to force js to assign a number instead of an object
    //So that the back-end is happy and there are no parsing errors (in theory)
    licence!.item = this.item.id as unknown as Item
    const user = this.users.find(l=>l.id==parseInt(userValue!))
    licence!.user = user ? user : null
    licence && this.item.licence.push(licence)
    this.resetInputs()
  }

  resetInputs(){
    this.searchLicenceSelect.setValue('---')
    this.searchUserSelect.setValue('---')
  }

  removeLicence(id:number){
    const licence = this.item.licence.find(l=>l.id==id)
      licence!.item = null
    this.itemLicences = this.item.licence.filter(l=>l.id!=id)
  }

  removeUserFromLicence(id:number){
    const licence = this.item.licence.find(l=>l.id==id)
      licence!.user = null
  }

  toggleLock(){
    this.is_locked = !this.is_locked
    this.getItem()
  }

  toggleAvailability(){
    if(this.is_locked)
      return;
    if(this.item.is_placed)
      return;
    this.item.is_available = !this.item.is_available
  }

  togglePlacement(){
    if(this.is_locked)
      return;
    if(!this.item.is_available&&!this.item.is_placed)
      return
    if(this.item.is_placed){
      this.item.is_placed = false
      this.item.is_available = true
    }else{
      this.item.is_placed = true
      this.item.is_available = false
    }
  }

  getItem(){
    //We get Item first so that the page display quickly
    this.service.getById(this.route.snapshot.paramMap.get('id')!).subscribe(
      res=>{
        this.item=res
        this.itemLicences=res.licence
      })
    //Then we fetch what is needed to populate the rest
    this.userService.get().subscribe(
      res => {
        this.users = res
        this.licenceService.get().subscribe(
          res=>{
            this.licences = res
            this.typeService.get().subscribe(
              res=>{
                this.types = res
              }
            )
          }
        )
      }
    )
  }

  put(){
    this.service.put(this.item).subscribe(
      res => {
        this.is_locked=true
        this.getItem()
      }
    )
  }

  getLicenceDescription(id:number){
    const tmp = this.licences.find(l=>l.id==id)
    return tmp ? tmp.description : ''
  }

  getUserDisplay(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? `${tmp.username}`: ''
  }

  filterOptions(){
    this.filterUserOptions()
    this.filterLicenceOptions()
  }

  filterUserOptions(){
    this.filteredUserOptions = this.searchUserSelect.valueChanges.pipe(
      startWith(''),
      map(value =>this._filterUser(value!||-1)))
  }

  filterLicenceOptions(){
    this.filteredLicenceOptions = this.searchLicenceSelect.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLicence(value!||-1)
      .filter(l=>!this.item.licence.map(l=>l.id).includes(l.id))))
  }
  private _filterLicence(value: number|string): Licence[] {
    return typeof(value)=="string" ? this._doFilterLicenceString(`${value}`)
      :this._doFilterLicenceInt(value)
  }

  private _doFilterLicenceInt(id:number){
    const tmp = this.licences.find(l=>l.id==id)
    return tmp ? this.licences.filter(l=>l.description==tmp.description):this.licences
  }

  private _doFilterLicenceString(input:string){
    return this.licences.filter(l=>l.description.toLowerCase().includes(input))
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
