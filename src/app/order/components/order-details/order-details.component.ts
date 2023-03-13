import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderItem, OrderType, OrderCreation } from '../../models/order';
import { ItemTypeService } from '../../../type/services/type/type.service';
import { OrderService } from '../../service/order/order.service';
import { RouterService } from '../../../services/router/router.service';
import { ToastService } from '../../../services/toast/toast.service';
import { ItemType } from 'src/app/type/models/type';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../../../item/models/item';
import { AuthService } from '../../../auth/services/auth/auth.service';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  public is_locked: boolean = true;
  public order:Order;
  public types:ItemType[] = [];
  constructor(public dialog:MatDialog,private orderService:OrderService, private itemTypeService:ItemTypeService, private route:ActivatedRoute, private toast:ToastService, public auth:AuthService){
    orderService.getById(this.route.snapshot.paramMap.get('order_id')!).subscribe(
      res=>{
        this.order = res
        this._setReceivedDate();
        this._mergeItemsAndTypes();
        this._computePrice();
      }
    )
    this.itemTypeService.get().subscribe(
      res=>{
        this.types = res
      }
    )
  }

  public receive(){
    this.order.isReceived = true
    this.put()
  }

  public put(){
    this.orderService.put(this.order).subscribe(
      res=>{
        this.order = res
        this._mergeItemsAndTypes();
        this.toast.setSuccess()
        this.is_locked = true;
      }
    )
  }

  isComplete(){
    for(const item of this.order.items){
      if(!item.serialNumber || item.serialNumber == "")
        return false
      if(!item.receivedAt)
        return false
    }
    return true
  }

  updateDialog(type:any, index:any) {
    const dialogRef = this.dialog.open(UpdateModal, {data:type.items![index]});

    dialogRef.afterClosed().subscribe(result => {
      if(typeof result == "object"){
        type!.items![index] = result

        this.order.items = this.order.items.filter(i=>i.id!=result.id)
        this.order.items.push(result)
      }
    });
  }

  public toggleLock(){
    this.is_locked = !this.is_locked
  }

  public getTotalPrice(){
    let price = 0
    for(let type of this.order.types){
      price += type.price || 0
    }
    return Number((Math.round(price* 100) / 100).toFixed(2))
  }

  private _mergeItemsAndTypes(){
    for(let type of this.order.types){
      type.items = this.order.items.filter(i=>i.type.id == type.type.id)
    }
  }

  private _computePrice(){
    for(let type of this.order.types){
      let price = 0
      if(!type.items){
        type.price = price
      } else {
        for(let item of type.items){
          price += item.price
        }
        type.price = Number((Math.round(price* 100) / 100).toFixed(2))
      }
    }
  }

  private _getCurrentDateForInput(){
    return this._getDateForInput(new Date(Date.now()))
  }

  private _getDateForInput(date:Date){
    return date.toISOString().split('T')[0]
  }

  private _setReceivedDate(){
    for(let item of this.order.items){
      if(!item.receivedAt)
        item.receivedAt = this._getCurrentDateForInput() as unknown as Date
    }
  } 
}

@Component({
  selector: 'update-modal',
  templateUrl: 'update-modal.html',
})

export class UpdateModal {

  public item: Item
  public types: ItemType[]

  constructor(public dialogRef: MatDialogRef<UpdateModal>, private builder:FormBuilder, @Inject(MAT_DIALOG_DATA) private data: Item){
    this.item = data
    /*
    this.item = structuredClone(data.item)
    this.types = data.types;
    */
    if(!this.item.receivedAt)
      this.item.receivedAt = this._getCurrentDateForInput() as unknown as Date
  
  }

  public form:FormGroup

  ngOnInit(){
    this.form = this.builder.group({
      price: [this.item?.price ? this.item.price : '', [Validators.required, Validators.min(1)]],
      description: [this.item?.description ? this.item.description : '', [Validators.required, Validators.minLength(10)]],
      serialNumber: [this.item?.serialNumber ? this.item.serialNumber : '', [Validators.required]],
      receivedAt: [this.item.receivedAt, [Validators.required]],
      purchasedAt: [this.item?.purchasedAt ? this._getDateForInput(this.item.purchasedAt) : this._getCurrentDateForInput(), [Validators.required]],
      checkupInterval: [this.item?.checkupInterval ? this.item.checkupInterval : 365, [Validators.required, Validators.min(1)]],
    })
  }

  public close(){
    this.dialogRef.close(this.item);
  }

  private _getCurrentDateForInput(){
    return this._getDateForInput(new Date(Date.now()))
  }

  private _getDateForInput(date:Date){
    return new Date(date).toISOString().split('T')[0]
  }
}