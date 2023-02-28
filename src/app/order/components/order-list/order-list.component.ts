import { AfterViewInit, Component, ViewChild, OnInit, Pipe } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { OrderListDataSource } from './order-list-datasource';
import { FormControl } from '@angular/forms';
import { tap } from 'rxjs';
import { ItemTypeService } from '../../../type/services/type/type.service';
import { ItemService } from '../../../item/services/item/item.service';
import { OrderService } from '../../service/order/order.service';
import { UserService } from '../../../user/services/user/user.service';
import { IUser } from 'src/app/user/models/user';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  dataSource: OrderListDataSource = new OrderListDataSource([]);
  public users: IUser[];
  public sortBy = new FormControl<string>('id');
  public isAsc = new FormControl<boolean>(true);
  public filterBy = new FormControl<number|null>(null);
  public searchBy = new FormControl<string>('');

  constructor(private orderService:OrderService, private userService:UserService, private router:RouterService) {

  }

  ngOnInit(): void {
    this.dataSource = new OrderListDataSource([])
    this.orderService.get().subscribe(
      res => {
        this.dataSource = new OrderListDataSource(res)
      }
    );
    this.userService.get().subscribe(res=>this.users = res)
  }

  goTo(id:number){
    this.router.navigateTo(`/order/${id}`)
  }

  goToOrderCreation(){
    this.router.navigateTo(`/order/create`)
  }

  setAsc(asc:boolean){
    this.isAsc.setValue(asc)
  }

  resetFilter(){
    this.filterBy.setValue(null)
  }
}