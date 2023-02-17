import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, Observable, of, filter } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { ItemType } from 'src/app/type/models/type';
import { ItemTypeService } from 'src/app/type/services/type/type.service';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item/item.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Licence } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';
import { User } from '../../../user/models/user';
import { UserService } from '../../../user/services/user/user.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-item-creation',
  templateUrl: './item-creation.component.html',
  styleUrls: ['./item-creation.component.scss']
})
export class ItemCreationComponent {

  public item:Item = {
    reference: '',
    description: '',
    type: {id:1} as ItemType,
    checkup_interval: '',
    last_checkup_at: this._getCurrentDateForInput(),
    price: '',
    provider: '',
    room: '',
    unit: '',
    licence: [],
    serial_number: '',
    purchased_at: null,
    received_at: null,
    warranty_expires_at: null,
    is_available: true, 
    is_placed: false
  } as unknown as Item;

  public itemLicences:Licence[] = [];
  public types:ItemType[];
  public licences:Licence[];
  public users:User[];
  public filteredLicenceOptions:Observable<Licence[]>;
  public filteredUserOptions:Observable<User[]>;
  public searchLicenceSelect = new FormControl<string>('---');
  public searchUserSelect = new FormControl<string>('---');

  form:FormGroup

  constructor(private toast:ToastService, private service:ItemService, private typeService:ItemTypeService, private licenceService:LicenceService, private userService:UserService, private router:RouterService, private builder:FormBuilder, private route:ActivatedRoute){
    this.getItem()
    this.form = builder.group({
      reference: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      serial_number: ['', [Validators.required, Validators.minLength(5)]],
      unit: ['', [Validators.required, Validators.minLength(2)]],
      room: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      provider: ['', [Validators.required, Validators.minLength(5)]],
      purchased_at: ['', [Validators.required]],
      received_at: ['', [Validators.required]],
      warranty_expires_at: ['', [Validators.required]],
      checkup_interval: ['', [Validators.required, Validators.min(1)]],
    })
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
    licence && this.itemLicences.push(licence)
    this.resetInputs()
  }

  resetInputs(){
    this.searchLicenceSelect.setValue('---')
    this.searchUserSelect.setValue('---')
  }

  removeLicence(id:number){
    const licence = this.item.licence.find(l=>l.id==id)
      licence!.item = null
    this.itemLicences = this.itemLicences.filter(l=>l.id!=id)
  }

  removeUserFromLicence(id:number){
    const licence = this.item.licence.find(l=>l.id==id)
      licence!.user = null
  }

  toggleAvailability(){
    if(this.item.is_placed)
      return;
    this.item.is_available = !this.item.is_available
  }

  togglePlacement(){
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

  post(){
    if(this.form.valid)
      this.service.post(this.item).subscribe(
        res => {
          this.router.navigateTo(`/item/${res}`)
          this.toast.setSuccess()
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
      map(value => this._filterLicence(value!||-1)),
      map(value => value.filter(l=>l.item==null)))
  }

  private _getCurrentDateForInput(){
    return this._getDateForInput(new Date(Date.now()))
  }

  private _getDateForInput(date:Date){
    return date.toISOString().split('T')[0]
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
