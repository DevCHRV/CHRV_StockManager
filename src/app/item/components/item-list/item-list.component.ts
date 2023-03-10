import { AfterViewInit, Component, ViewChild, OnInit, Pipe } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item/item.service';
import { ItemListDataSource } from './item-list-datasource';
import { FormControl } from '@angular/forms';
import { tap, filter } from 'rxjs';
import { ItemTypeService } from '../../../type/services/type/type.service';
import * as moment from 'moment';
import { ItemType } from '../../../type/models/type';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  dataSource: ItemListDataSource = new ItemListDataSource([]);
  public types: ItemType[]
  public sortBy = new FormControl<string>('lastCheckupAt');
  public isAsc = new FormControl<boolean>(true);
  public filterBy = new FormControl<number|null>(null);
  public filterBy2 = new FormControl<number|null>(null);
  public searchBy = new FormControl<string>('');

  public is_total:boolean = true

  constructor(private items:ItemService, private typeService:ItemTypeService, private router:RouterService) {
    this.items.clearSelected()
  }

  ngOnInit(): void {
    this.dataSource = new ItemListDataSource([])
    this.items.get().subscribe(
      res => {
        this.dataSource = new ItemListDataSource(res)
      }
    );
    this.typeService.get().subscribe(res=>this.types = res)
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

  getType(){
    if(this.filterBy.value && this.types){
      const type = this.types.find(t=>t.id == this.filterBy.value)
      return {type: type, totalQuantity: type?.totalQuantity, availableQuantity: type?.availableQuantity}
    }
    return {totalQuantity: this.dataSource.data.length, availableQuantity:this.dataSource.data.filter(i=>i.isAvailable).length, type:null}
  }

  //Return 1 if date is equal or passed
  isCheckUpClose(item:Item){
    const last = moment(item.lastCheckupAt)
    const current = moment()
    const days = current.diff(last, 'days')
    const days_left = item.checkupInterval-days
    if(days_left<=0)
      return 1
    if(days_left <=30)
      return 0
    return -1
  }

  check(event:any, item:Item){
    const checked = event.target.checked
    if(checked)
      this.items.pushSelected(item)
    else
      this.items.removeSelected(item)
  }

  isMobile(){
    return Capacitor.getPlatform()!="web"
  }

  goTo(id:number){
    this.router.navigateTo(`/item/${id}`)
  }

  goToItemCreation(){
    this.router.navigateTo(`/item/create`)
  }

  goToItemQRList(){
    this.router.navigateTo(`/item/qr`)
  }

  goToItemImport(){
    this.router.navigateTo(`/item/import`)
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
}