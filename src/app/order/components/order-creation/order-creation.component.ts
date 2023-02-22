import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item, ItemType } from '../../../item/models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order } from '../../models/order';
import { ItemTypeService } from '../../../type/services/type/type.service';
import { OrderService } from '../../service/order/order.service';
import { RouterService } from '../../../services/router/router.service';
import { ToastService } from '../../../services/toast/toast.service';

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

  openDialog() {
    const dialogRef = this.dialog.open(Modal);

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      typeof result == "object" && this.order.items.push(result)
    });
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

  constructor(public dialogRef: MatDialogRef<Modal>, private builder:FormBuilder, private itemTypeService:ItemTypeService){
    this.form = builder.group({
      reference: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      serial_number: ['', [Validators.required, Validators.minLength(5)]],
      unit: ['', [Validators.required, Validators.minLength(2)]],
      room: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      provider: ['', [Validators.required, Validators.minLength(5)]],
      purchased_at: ['', [Validators.required]],
      received_at: [''],
      warranty_expires_at: ['', [Validators.required]],
      checkup_interval: ['', [Validators.required, Validators.min(1)]],
    })
  }

  public item:Item = {
    reference: '',
    description: '',
    type: {id:1, name:"Nope"} as ItemType,
    checkup_interval: 365,
    last_checkup_at: this._getCurrentDateForInput(),
    price: '',
    provider: '',
    room: '',
    unit: '',
    licence: [],
    serial_number: '',
    purchased_at: this._getCurrentDateForInput(),
    received_at: null,
    warranty_expires_at: this._getCurrentDateForInput(),
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
    return date.toISOString().split('T')[0]
  }
}