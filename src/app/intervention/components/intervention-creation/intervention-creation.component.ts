import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';
import { ToastService } from '../../../services/toast/toast.service';
import { UserService } from '../../../user/services/user/user.service';
import { RouterService } from '../../../services/router/router.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../user/models/user';
import { Observable, startWith, map, tap } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Intervention, InterventionType } from '../../models/intervention';
import { InterventionService } from '../../services/intervenction/intervention.service';
import { ItemService } from '../../../item/services/item/item.service';
import { Item } from '../../../item/models/item';
import { Licence } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';

@Component({
  selector: 'app-intervention-creation',
  templateUrl: './intervention-creation.component.html',
  styleUrls: ['./intervention-creation.component.scss'],
})
export class InterventionCreationComponent {

  public intervention:Intervention = {
    ticket_number:'',
    description:'',
    notifier:{id:-1},
    expectedDate: this._getCurrentDateForInput(),
    actualDate: this._getCurrentDateForInput(),
    item: null,
    licences: [],
    unit:'',
    room:'',
    type: {id:1} as unknown as InterventionType,
  } as unknown as Intervention;
  public licences:Licence[];
  public users:User[];
  public types:InterventionType[];

  public filteredNotifierOptions:Observable<User[]>;
  public searchNotifierSelect = new FormControl<string>('---');

  public filteredUserOptions:Observable<User[]>;
  public searchUserSelect = new FormControl<string>('---');

  public searchLicenceSelect = new FormControl<string>('---');
  public filteredLicenceOptions:Observable<Licence[]>;

  public form:FormGroup

  constructor(private toast:ToastService, private service:InterventionService, private itemService:ItemService, private userService:UserService, private licenceService:LicenceService, private router:RouterService, private builder:FormBuilder, private route:ActivatedRoute){

  }

  ngOnInit(){
    this.itemService.getById(this.route.snapshot.paramMap.get('item_id')!).subscribe(
      res=>{
        this.intervention.licences = res.licence
        res.licence = []
        this.intervention.item = res
        this.intervention.item = res
        this._init()
      })
    this.service.getTypes().subscribe(
      res=>this.types = res
    )
    this.userService.get().subscribe(
      res=>{
        this.users = res
        this.licenceService.get().subscribe(
          res=>{
            this.licences = res
            //console.log(this.licences)
            this.filterOptions()
          }
        )
      }
    )
  }

  post(){
    if(this.form.valid)
      this.service.post(this.intervention).subscribe(
        res=>this.router.navigateBack()
      )
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
    licence!.item = this.intervention.item.id as unknown as Item
    const user = this.users.find(l=>l.id==parseInt(userValue!))
    licence!.user = user ? user : null
    licence && this.intervention.licences.push(licence)
    this.resetInputs()
  }

  removeLicence(id:number){
    this.intervention.item.licence =  this.intervention.item.licence.filter(l=>l.id!=id)
    this.intervention.licences = this.intervention.licences.filter(l=>l.id!=id)
  }

  removeUserFromLicence(id:number){
    const licence = this.intervention.item.licence.find(l=>l.id==id)
      licence!.user = null
  }

  resetInputs(){
    this.searchLicenceSelect.setValue('---')
    this.searchUserSelect.setValue('---')
  }

  getUserDisplay(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? `${tmp.username}`: ''
  }

  
  getLicenceDescription(id:number){
    const tmp = this.licences?.find(l=>l.id==id)
    return tmp ? tmp.description : ''
  }

  filterOptions(){
    this.filterUserOptions()
    this.filterLicenceOptions()
  }

  filterUserOptions(){
    this.filteredUserOptions = this.searchUserSelect.valueChanges.pipe(
      startWith(''),
      map(value =>this._filterUser(value!||-1)))
    this.filteredNotifierOptions = this.searchNotifierSelect.valueChanges.pipe(
      startWith(''),
      tap(value=>{
        if( typeof(value)!='string'){
          this.intervention.notifier = this.users.find(u=>u.id==value)
        }
        else {
          this.intervention.notifier = undefined
        }
      }),
      map(value => this._filterUser(value!||-1)))
  }

  filterLicenceOptions(){
    this.filteredLicenceOptions = this.searchLicenceSelect.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLicence(value!||-1)),
      map(value => value.filter(l=>l.item==null)),
      )
  }

  private _init(){
    this._fillModelValues()
    this._initForm()
  }

  private _initForm(){
    this.form = this.builder.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      unit: [this.intervention.item.unit, [Validators.required, Validators.minLength(2)]],
      room: [this.intervention.item.room, [Validators.required, Validators.minLength(2)]],
      expectedDate: [this._getCurrentDateForInput(), [Validators.required]],
      actualDate: [this._getCurrentDateForInput(), [Validators.required]],
    })
  }

  private _fillModelValues(){
    this.intervention.room = this.intervention.item.room
    this.intervention.unit = this.intervention.item.unit
  }

  private _getCurrentDateForInput(){
    return this._getDateForInput(new Date(Date.now()))
  }

  private _getDateForInput(date:Date){
    return date.toISOString().split('T')[0]
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
    return this.users.filter(u=>`${u.username}${u.firstname}${u.lastname}`.toLowerCase().includes(input.toLowerCase()))
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
    return this.licences.filter(l=>l.description.toLowerCase().includes(input.toLowerCase()))
  }

}
