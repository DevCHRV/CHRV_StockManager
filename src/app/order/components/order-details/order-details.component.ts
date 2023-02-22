import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item, ItemType } from '../../../item/models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../models/order';
import { ItemTypeService } from '../../../type/services/type/type.service';
import { OrderService } from '../../service/order/order.service';
import { ActivatedRoute } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  public is_locked: boolean = true;
  public order:Order;

  constructor(public dialog:MatDialog,private orderService:OrderService, private route:ActivatedRoute, private toast:ToastService){
    orderService.getById(this.route.snapshot.paramMap.get('order_id')!).subscribe(
      res=>{
        this.order = res
        this._mergeItemsAndTypes();
      }
    )
  }

  public put(){
    this.orderService.put(this.order).subscribe(
      res=>this.toast.setSuccess()
    )
  }

  public toggleLock(){
    this.is_locked = !this.is_locked
  }

  private _mergeItemsAndTypes(){
    for(let type of this.order.types){
      type.items = this.order.items.filter(i=>i.type.id == type.type.id)
    }
  }

  private _getCurrentDateForInput(){
    return this._getDateForInput(new Date(Date.now()))
  }

  private _getDateForInput(date:Date){
    return date.toISOString().split('T')[0]
  }
}