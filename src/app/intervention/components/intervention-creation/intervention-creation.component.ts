import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';
import { ToastService } from '../../../services/toast/toast.service';
import { UserService } from '../../../user/services/user/user.service';
import { RouterService } from '../../../services/router/router.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../../../user/models/user';
import { Observable, startWith, map, tap } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Intervention, InterventionType } from '../../models/intervention';
import { InterventionService } from '../../services/intervenction/intervention.service';
import { ItemService } from '../../../item/services/item/item.service';
import { Item } from '../../../item/models/item';
import { Licence } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';
import { InterventionTypeEnum } from '../../models/InterventionTypeEnum';
import { Room } from '../../../unit/models/unit';
import { UnitService } from '../../../unit/services/unit/unit.service';

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
    actualDate: null,
    item: null,
    licences: [],
    unit:'',
    room:'',
    type: {id:1} as unknown as InterventionType,
  } as unknown as Intervention;
  public licences:Licence[] = [];
  public rooms:Room[] = []
  public ldapUsers:IUser[] = [];
  public types:InterventionType[] = [];

  public filteredNotifierOptions:Observable<IUser[]>;
  public searchNotifierSelect = new FormControl<string>("");

  public filteredRoomOptions:Observable<Room[]>;
  public searchRoomSelect = new FormControl<string>("");

  public filteredUserOptions:Observable<IUser[]>;
  public searchUserSelect = new FormControl<string>("");

  public filteredLicenceOptions:Observable<Licence[]>;
  public searchLicenceSelect = new FormControl<string>('---');


  public form:FormGroup

  constructor(private toast:ToastService, private service:InterventionService, private itemService:ItemService, private userService:UserService, private licenceService:LicenceService, private unitService:UnitService, private router:RouterService, private builder:FormBuilder, private route:ActivatedRoute){
    this.form = builder.group({
      description: ['', [Validators.required, Validators.minLength(1)]],
      expectedDate: ['', [Validators.required]],
    })  
  }

  ngOnInit(){
    this.itemService.getById(this.route.snapshot.paramMap.get('item_id')!).subscribe(
      res=>{
        this.intervention.licences = res.licence
        res.licence = []
        this.intervention.item = res
        this.licences = [...this.licences, ...res.licence]
        this._init()
      })
    this.userService.getLDAP().subscribe(
      res=>{
        this.ldapUsers = res
        this.filterUserOptions()
      }
    )
    this.unitService.getRooms().subscribe(
      res=>{
        this.rooms = res
        this.filterRoomOptions()
      }
    )
    this.service.getTypes().subscribe(
      res=>this.types = res
    )
    this.licenceService.get().subscribe(
      res=>{
        this.licences = res
        this.filterLicenceOptions()
      }
    )
  }

  post(){
    if(this.form.valid)
      this.service.post(this.intervention).subscribe(
        res=>this.router.navigateTo(`item/${this.intervention.item.id}`)
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
    const user = this.ldapUsers.find(l=>l.username==userValue)
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

  getUserDisplay(username:string){
    const tmp = this.ldapUsers.find(u=>u.username==username)
    return tmp ? `${tmp.username}`: ''
  }

  getRoomDisplay(room:Room){
    return room ? `${room.unit.name} | ${room.name}`: ''
  }

  getLicenceDescription(id:number){
    const tmp = this.licences?.find(l=>l.id==id)
    return tmp ? tmp.description : ''
  }

  filterOptions(){
    this.filterUserOptions()
    this.filterLicenceOptions()
    this.filterRoomOptions()
  }

  filterUserOptions(){
    this.filteredUserOptions = this.searchUserSelect.valueChanges.pipe(
      startWith(''),
      map(value => {
        return value == '' ? this.ldapUsers :
        this._filterLDAPUsers(value!||-1)
      }))
    this.filteredNotifierOptions = this.searchNotifierSelect.valueChanges.pipe(
      startWith(''),
      tap(value=>{
        const notifier = this.ldapUsers.find(u=>u.username==value)
        if(notifier){
          this.intervention.notifier = notifier
        }
        else {
          this.intervention.notifier = undefined
        }
      }),
      map(value => {
        return value == '' ? this.ldapUsers :
        this._filterLDAPUsers(value!||-1)
      }))
  }

  filterLicenceOptions(){
    this.filteredLicenceOptions = this.searchLicenceSelect.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLicence(value!||-1)),
      map(value => value.filter(l=>l.item==null)),
      )
  }

  filterRoomOptions(){
    this.filteredRoomOptions = this.searchRoomSelect.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRoom(value!||-1)),
    )
  }

  isLicenceIntervention(){
    return this.intervention.type.id == InterventionTypeEnum.InstallationLicence || this.intervention.type.id == InterventionTypeEnum.DesinstallationLicence
  }

  private _init(){
    this._fillModelValues()
    this._initForm()
  }

  private _initForm(){
    this.form = this.builder.group({
      description: ['', [Validators.required, Validators.minLength(10)]],
      room: [this.intervention.item.room, [Validators.required]],
      expectedDate: [this._getCurrentDateForInput(), [Validators.required]],
      actualDate: [null, []],
    })
  }

  private _fillModelValues(){
    this.intervention.room = this.intervention.item.room
  }

  private _getCurrentDateForInput(){
    return this._getDateForInput(new Date(Date.now()))
  }

  private _getDateForInput(date:Date){
    return date.toISOString().split('T')[0]
  }

  private _filterLDAPUsers(value: number|string): IUser[] {
    return this._doFilterLDAPUsersString(`${value}`)
  }

  private _doFilterLDAPUsersString(input:string){
    return this.ldapUsers.filter(u=>{
      return `${u.username||''}${u.firstname||''} ${u.lastname||''}`.toLowerCase().includes(input.toLowerCase())
    })
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

  private _filterRoom(value: number|string): Room[] {
    return typeof(value)=="string" ? this._doFilterRoomString(`${value}`)
      :this._doFilterRoomInt(value)
  }

  private _doFilterRoomInt(id:number){
    const tmp = this.rooms.find(r=>r.id==id)
    return tmp ? this.rooms.filter(r=>r.name==tmp.name):this.rooms
  }

  private _doFilterRoomString(input:string){
    return this.rooms.filter(r=>`${r.unit.name} ${r.name}`.toLowerCase().includes(input.toLowerCase()))
  }

}
