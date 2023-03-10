import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { LicenceListDataSource } from './licence-list-datasource';
import { LicenceService } from '../../services/licence/licence.service';
import { FormControl } from '@angular/forms';
import { LicenceType } from '../../models/licences';
import { LicenceTypeService } from '../../services/type/type.service';
import { UserService } from '../../../user/services/user/user.service';
import { IUser } from '../../../user/models/user';
import { tap, pipe, map, Observable, startWith } from 'rxjs';
import { ItemType } from '../../../type/models/type';

@Component({
  selector: 'app-licence-list',
  templateUrl: './licence-list.component.html',
  styleUrls: ['./licence-list.component.scss']
})
export class LicenceListComponent implements OnInit {
  public sortBy = new FormControl<string>('id');
  public isAsc = new FormControl<boolean>(true);
  public filterBy = new FormControl<number|null>(null);
  public filterBy2 = new FormControl<boolean|null>(null);
  public filteredUsersOptions:Observable<IUser[]>;
  public searchUserSelect = new FormControl<string>('');
  public searchBy = new FormControl<string>('');
  public types:LicenceType[];
  public users:IUser[] = [];
  dataSource: LicenceListDataSource= new LicenceListDataSource([]);

  constructor(private licences:LicenceService, private licenceTypeService:LicenceTypeService, private userService:UserService ,private router:RouterService) {
    this.filterBy.valueChanges.pipe(
      map(value=> (typeof(value)=='string' && value =='null')? null: value)
    ).subscribe()
  }

  ngOnInit(): void {
    this.dataSource = new LicenceListDataSource([])
    this.licences.get().subscribe(
      res => {
        this.dataSource = new LicenceListDataSource(res)
      }
    );
    this.licenceTypeService.get().subscribe(
      res => this.types = res
    )
    this.userService.get().subscribe(
      res=>{
        this.users = res
        this.filteredUsersOptions = this.searchUserSelect.valueChanges.pipe(
          startWith(''),
          map(value =>this._filterUser(value!||-1)))
      }
    )
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

  getLicenceType(){
    if(this.filterBy.value && this.searchUserSelect.value && this.types){
      return {totalQuantity: this.dataSource.data.filter(l=>l.type.id == this.filterBy.value).filter(l=>l.user?.id == (this.searchUserSelect.value && parseInt(this.searchUserSelect.value))).length, availableQuantity: 0, type: this.types.find(t=>t.id == this.filterBy.value)}
    }
    if(this.filterBy.value && this.types){
      const entries = this.dataSource.data.filter(l=>l.type.id == this.filterBy.value)
      return {totalQuantity: entries.length, availableQuantity: entries.filter(l=>l.user==null).length, type: this.types.find(t=>t.id == this.filterBy.value)}
    }
    if(this.searchUserSelect.value && this.types){
      return {totalQuantity: this.dataSource.data.filter(l=>l.user?.id==(this.searchUserSelect.value && parseInt(this.searchUserSelect.value))).length,  availableQuantity: 0, type: this.types.find(t=>t.id == this.filterBy.value)}
    }
    return {totalQuantity: this.dataSource.data.length, availableQuantity: this.dataSource.data.filter(l=>l.user==null).length}
  }

  goTo(id:number){
    this.router.navigateTo(`/licence/${id}`)
  }

  goToLicenceImport(){
    this.router.navigateTo(`licence/import`)
  }

  goToLicenceCreation(){
    this.router.navigateTo(`licence/create`)
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

  getUserDisplay(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? `${tmp.username}`: ''
  }

  resetSearchUserSelect(){
    this.searchUserSelect.setValue(null)
  }

  checkNotNull(event:any){
    let value = event.target.value
    if(value==null || value=='null')
      this.resetFilter()
  }

  checkNotNull2(event:any){
    let value = event.target.value
    if(value==null || value=='null')
    this.resetFilter2()
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
}