import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { InterventionListDataSource } from './intervention-list-datasource';
import { InterventionService } from '../../services/intervenction/intervention.service';
import { FormControl } from '@angular/forms';
import { Intervention, InterventionType } from '../../models/intervention';
import { UserService } from '../../../user/services/user/user.service';
import { IUser } from '../../../user/models/user';
import { Item } from '../../../item/models/item';
import { ItemService } from '../../../item/services/item/item.service';
import { Observable, startWith, map } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-intervention-list',
  templateUrl: './intervention-list.component.html',
  styleUrls: ['./intervention-list.component.scss']
})
export class InterventionListComponent implements OnInit {
  public sortBy = new FormControl<string>('id');
  public isAsc = new FormControl<boolean>(false);
  public filterBy = new FormControl<number|null>(null);
  public filterBy2 = new FormControl<boolean|null>(null);
  public filteredItemsOptions:Observable<Item[]>;
  public searchItemSelect = new FormControl<string>('');
  public filteredUsersOptions:Observable<IUser[]>;
  public searchUserSelect = new FormControl<string>('');

  public searchBy = new FormControl<string>('');
  public types:InterventionType[];
  public users:IUser[] = [];
  public items:Item[] = [];
  dataSource: InterventionListDataSource = new InterventionListDataSource([]);

  constructor(private interventions:InterventionService, private userService:UserService, private router:RouterService, private itemService:ItemService) {

  }

  ngOnInit(): void {
    this.dataSource = new InterventionListDataSource([])
    this.interventions.get().subscribe(
      res => {
        this.dataSource = new InterventionListDataSource(res)
        this._mergeItems()
        this.init()
      }
    );
    this.interventions.getTypes().subscribe(
      res=>this.types = res
    )
    this.userService.get().subscribe(
      res=>this.users = res
    )
  }

  init(){
    this.filteredItemsOptions = this.searchItemSelect.valueChanges.pipe(
      startWith(''),
      map(value =>this._filterItem(value!||-1)))
    this.filteredUsersOptions = this.searchUserSelect.valueChanges.pipe(
      startWith(''),
      map(value =>this._filterUser(value!||-1)))
  }

  orderBy(property:string){
    if(this.sortBy.value == property){
      this.isAsc.patchValue(!this.isAsc.value)
      this.sortBy.patchValue(property)
    } else {
      this.isAsc.patchValue(true)
      this.sortBy.patchValue(property)
    }
  }

  goTo(id:number){
    this.router.navigateTo(`/intervention/${id}`)
  }

  setAsc(asc:boolean){
    this.isAsc.setValue(asc)
  }

  resetFilter(){
    this.filterBy.setValue(null)
  }

  resetFilter2(){
    this.filterBy2.setValue(null)
  }

  resetSearchUserSelect(){
    this.searchUserSelect.setValue(null)
  }
  
  resetSearchItemSelect(){
    this.searchItemSelect.setValue(null)
  }

  getItemDisplay(id:number){
    const tmp = this.items.find(u=>u.id==id)
    return tmp ? `${tmp.reference}`: ''
  }

  getUserDisplay(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? `${tmp.username}`: ''
  }

  //Return 1 if date is equal or passed
  isExpectedClose(intervention:Intervention){
    if(intervention.actualDate)
      return -1

    if(moment().isAfter(intervention.expectedDate)){
      return 1
    } else {
      return 0
    }
  }

  private _filterItem(value: number|string): Item[] {
    return typeof(value)=="string" ? this._doFilterItemString(`${value}`)
      :this._doFilterItemInt(value)
  }

  
  private _doFilterItemInt(id:number){
    const tmp = this.items.find(i=>i.id==id)
    return tmp ? this.items.filter(i=>i.id==tmp.id):this.items
  }

  private _doFilterItemString(input:string){
    return this.items.filter(i=>`${i.reference}`.toLowerCase().includes(input.toLowerCase()))
  }

  private _filterUser(value: number|string): IUser[] {
    return typeof(value)=="string" ? this._doFilterUserString(`${value}`)
      :this._doFilterUserInt(value)
  }

  
  private _doFilterUserInt(id:number){
    const tmp = this.users.find(i=>i.id==id)
    return tmp ? this.users.filter(i=>i.id==tmp.id):this.users
  }

  private _doFilterUserString(input:string){
    return this.users.filter(u=>`${u.username}${u.firstname}${u.lastname}`.toLowerCase().includes(input.toLowerCase()))
  }


  private _mergeItems(){
    for(const i of this.dataSource.data){
      if(!this.items.find(item=>item.id == i.item.id))
        this.items.push(i.item)
    }
  }
}