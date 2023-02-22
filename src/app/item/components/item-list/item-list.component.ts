import { AfterViewInit, Component, ViewChild, OnInit, Pipe } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { Item, ItemType } from '../../models/item';
import { ItemService } from '../../services/item/item.service';
import { ItemListDataSource } from './item-list-datasource';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';
import { ItemTypeService } from '../../../type/services/type/type.service';
import * as moment from 'moment';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  dataSource: ItemListDataSource = new ItemListDataSource([]);
  public types: ItemType[]
  public sortBy = new FormControl<string>('id');
  public isAsc = new FormControl<boolean>(true);
  public filterBy = new FormControl<number|null>(null);
  public searchBy = new FormControl<string>('');

  constructor(private items:ItemService, private typeService:ItemTypeService, private router:RouterService) {

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

  //Return 1 if date is equal or passed
  isCheckUpClose(item:Item){
    const last = moment(item.last_checkup_at)
    const current = moment()
    const days = current.diff(last, 'days')
    const days_left = item.checkup_interval-days
    if(days_left<=0)
      return 1
    if(days_left <=30)
      return 0
    return -1
  }

  goTo(id:number){
    this.router.navigateTo(`/item/${id}`)
  }

  goToItemCreation(){
    this.router.navigateTo(`/item/create`)
  }

  setAsc(asc:boolean){
    this.isAsc.setValue(asc)
  }

  resetFilter(){
    this.filterBy.setValue(null)
  }
}