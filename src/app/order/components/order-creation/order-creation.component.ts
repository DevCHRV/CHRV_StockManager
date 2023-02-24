import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../../../item/models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../models/order';
import { ItemTypeService } from '../../../type/services/type/type.service';
import { OrderService } from '../../service/order/order.service';
import { RouterService } from '../../../services/router/router.service';
import { ToastService } from '../../../services/toast/toast.service';
import { ItemType } from 'src/app/type/models/type';

@Component({
  selector: 'app-order-creation',
  templateUrl: './order-creation.component.html',
  styleUrls: ['./order-creation.component.scss']
})
export class OrderCreationComponent {

  public is_shown: boolean = false;

  public order:Order = {
    date: this._getCurrentDateForInput(),
    items: [],
    user: null,
    types:null,
    isReceived: false,
  } as unknown as Order;

  public form:FormGroup

  constructor(public dialog:MatDialog, private builder:FormBuilder, private orderService:OrderService, private router:RouterService, private toast:ToastService){
    this.form = builder.group({
      date: [this._getCurrentDateForInput(), [Validators.required]],
    })
  }

  public post(){
    if(this.form.valid)
      this.orderService.post(this.order).subscribe(
        res=>{
          this.router.navigateTo(`order/${res}`)
          this.toast.setSuccess()
        }
      )
  }

  createDialog() {
    const dialogRef = this.dialog.open(Modal);

    dialogRef.afterClosed().subscribe(result => {
      typeof result == "object" && this.order.items.push(result)
    });
  }

  updateDialog(item:Item) {
    const dialogRef = this.dialog.open(Modal, {data:item});

    dialogRef.afterClosed().subscribe(result => {
      if(typeof result == "object"){
        this.order.items = this.order.items.filter(i=>i.reference != result.reference && i.serial_number != result.serial_number);
        this.order.items.push(result)
      }
    });
  }

  removeItem(item:Item){
    this.order.items = this.order.items.filter(i=>i.reference != item.reference && i.serial_number != item.serial_number)
  }

  public toggleShown(){
    this.is_shown = !this.is_shown
  }

  private _getCurrentDateForInput(){
    return this._getDateForInput(new Date(Date.now()))
  }

  private _getDateForInput(date:Date){
    return date.toISOString().split('T')[0]
  }
}

@Component({
  selector: 'modal',
  templateUrl: 'modal.html',
})

export class Modal {

  constructor(public dialogRef: MatDialogRef<Modal>, private builder:FormBuilder, private itemTypeService:ItemTypeService, @Inject(MAT_DIALOG_DATA) private data?:Item){
    this.form = builder.group({
      reference: [data?.reference ? data.reference : '', [Validators.required]],
      price: [data?.price ? data.price : '', [Validators.required, Validators.min(1)]],
      type: [data?.type ? data.type : '', Validators.required],
      serial_number: [data?.serial_number ? data.serial_number : '', [Validators.required, Validators.minLength(5)]],
      unit: [data?.unit ? data.unit : '', [Validators.required, Validators.minLength(2)]],
      room: [data?.room ? data.room : '', [Validators.required, Validators.minLength(2)]],
      description: [data?.description ? data.description : '', [Validators.required, Validators.minLength(10)]],
      provider: [data?.provider ? data.provider : '', [Validators.required, Validators.minLength(5)]],
      purchased_at: [data?.purchased_at ? this._getDateForInput(data.purchased_at) : this._getCurrentDateForInput(), [Validators.required]],
      received_at: [data?.received_at ? this._getDateForInput(data.received_at) : ''],
      warranty_expires_at: [data?.warranty_expires_at ? this._getDateForInput(data.warranty_expires_at) : '', [Validators.required]],
      checkup_interval: [data?.checkup_interval ? data.checkup_interval : 365, [Validators.required, Validators.min(1)]],
    })
  }

  public item:Item = {
    reference: this.data?.reference ? this.data.reference : '',
    description: this.data?.description ? this.data.description : '',
    type: this.data?.type ? this.data.type :{id:1, name:"tmp"} as ItemType,
    checkup_interval: this.data?.checkup_interval ? this.data.checkup_interval : 365,
    last_checkup_at: this.data?.last_checkup_at ? this._getDateForInput(this.data.last_checkup_at) : this._getCurrentDateForInput(),
    price: this.data?.price ? this.data.price : '',
    provider: this.data?.provider ? this.data.provider : '',
    room: this.data?.room ? this.data.room : '',
    unit: this.data?.room ? this.data.room : '',
    licence: [],
    serial_number: this.data?.serial_number ? this.data.serial_number : '',
    purchased_at: this.data?.purchased_at ? this._getDateForInput(this.data.purchased_at) : this._getCurrentDateForInput(),
    received_at: this.data?.received_at ? this._getDateForInput(this.data.received_at) : '',
    warranty_expires_at: this.data?.warranty_expires_at ? this._getDateForInput(this.data.warranty_expires_at) : this._getCurrentDateForInput(),
    is_available: true, 
    is_placed: false,
    order:null
  } as unknown as Item;

  public form:FormGroup

  public types: ItemType[] = [];

  ngOnInit(){
    this.itemTypeService.get().subscribe(
      res=>{
        this.types = res
        this.item.type = res[0]
        this.form.patchValue({type:res[0]})
      }
    )
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