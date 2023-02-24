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
import { User } from '../../../user/models/user';
import { tap, pipe, map } from 'rxjs';
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
  public filterBy2 = new FormControl<number|null>(null);
  public searchBy = new FormControl<string>('');
  public types:LicenceType[];
  public users:User[];
  dataSource: LicenceListDataSource= new LicenceListDataSource([]);

  constructor(private licences:LicenceService, private licenceTypeService:LicenceTypeService, private userService:UserService ,private router:RouterService) {
    this.filterBy.valueChanges.pipe(
      map(value=> (typeof(value)=='string' && value =='null')? null: value)
    ).subscribe()
    this.filterBy2.valueChanges.pipe(
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
      res=> this.users =res
    )
  }

  getLicenceType(){
    if(this.filterBy.value && this.filterBy2.value && this.types){
      return {totalQuantity: this.dataSource.data.filter(l=>l.type.id == this.filterBy.value).filter(l=>l.user?.id==this.filterBy2.value).length, availableQuantity: 0, type: this.types.find(t=>t.id == this.filterBy.value)}
    }
    if(this.filterBy.value && this.types){
      const entries = this.dataSource.data.filter(l=>l.type.id == this.filterBy.value)
      return {totalQuantity: entries.length, availableQuantity: entries.filter(l=>l.user==null).length, type: this.types.find(t=>t.id == this.filterBy.value)}
    }
    if(this.filterBy2.value && this.types){
      return {totalQuantity: this.dataSource.data.filter(l=>l.user?.id==this.filterBy2.value).length,  availableQuantity: 0, type: this.types.find(t=>t.id == this.filterBy.value)}
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
}