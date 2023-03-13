import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderItem, OrderType, OrderCreation } from '../../models/order';
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

  public order:OrderCreation = {
    date: this._getCurrentDateForInput(),
    items: [] as OrderItem[],
    types: [] as OrderType[],
  } as unknown as OrderCreation;

  public form:FormGroup

  constructor(public dialog:MatDialog, private builder:FormBuilder, private orderService:OrderService, private router:RouterService, private toast:ToastService){
    this.form = builder.group({
      date: [this._getCurrentDateForInput(), [Validators.required]],
    })
  }

  public post(){
    //TODO Write items in a readable way for the back-end
    if(this.form.valid)
      this.orderService.post(this.order as unknown as Order).subscribe(
        res=>{
          this.router.navigateTo(`order/${res}`)
          this.toast.setSuccess()
        }
      )
  }

  createDialog() {
    const dialogRef = this.dialog.open(Modal);

    dialogRef.afterClosed().subscribe(result => {
      if(typeof result == "object"){
        const type = this.order.types.find(t=>t.id == result.type.id)
        if(!type){
          this.order.types.push({id: result.type.id, alias: result.type.alias, name:result.type.name, description: result.type.description, items: [result]})
        }
        else {
          type.items?.push(result)
        }
      }
    });
  }

  updateDialog(type:OrderType, index:number) {
    const dialogRef = this.dialog.open(Modal, {data:type.items![index]});

    dialogRef.afterClosed().subscribe(result => {
      if(typeof result == "object"){
        //this.order.types = this.types.items.filter(i=>i.reference != result.reference && i.serial_number != result.serial_number);
        type!.items![index] = result
      }
    });
  }

  removeItem(type:OrderType, index:number){
    type.items?.splice(index,1)
    if(type.items?.length==0){
      this.order.types = this.order.types.filter(t=>t.id!=type.id)
    }
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
  selector: 'creation-modal',
  templateUrl: 'modal.html',
})

export class Modal {

  constructor(public dialogRef: MatDialogRef<Modal>, private builder:FormBuilder, private itemTypeService:ItemTypeService, @Inject(MAT_DIALOG_DATA) private data?:OrderItem){
    this.form = builder.group({
      price: [data?.price ? data.price : '', [Validators.required, Validators.min(1)]],
      quantity: [data?.quantity? data?.quantity : 0, [Validators.required, Validators.min(1)]],
      type: [data?.type ? data.type : '', Validators.required],
      description: [data?.description ? data.description : '', [Validators.required, Validators.minLength(10)]],
      provider: [data?.provider ? data.provider : '', [Validators.required, Validators.minLength(5)]],
      purchasedAt: [data?.purchasedAt ? this._getDateForInput(data.purchasedAt) : this._getCurrentDateForInput(), [Validators.required]],
      warrantyExpiresAt: [data?.warrantyExpiresAt ? this._getDateForInput(data.warrantyExpiresAt) : '', [Validators.required]],
      checkupInterval: [data?.checkupInterval ? data.checkupInterval : 365, [Validators.required, Validators.min(1)]],
    })
  }
  
  public item:OrderItem = {
    description: this.data?.description ? this.data.description : '',
    type: this.data?.type ? this.data.type :{id:1, name:"tmp"} as ItemType,
    checkupInterval: this.data?.checkupInterval ? this.data.checkupInterval : 365,
    lastCheckupAt: this.data?.lastCheckupAt ? this._getDateForInput(this.data.lastCheckupAt) : this._getCurrentDateForInput(),
    price: this.data?.price ? this.data.price : '',
    quantity: this.data?.quantity ? this.data.quantity : 0,
    provider: this.data?.provider ? this.data.provider : '',
    purchasedAt: this.data?.purchasedAt ? this._getDateForInput(this.data.purchasedAt) : this._getCurrentDateForInput(),
    warrantyExpiresAt: this.data?.warrantyExpiresAt ? this._getDateForInput(this.data.warrantyExpiresAt) : this._getCurrentDateForInput(),
    order:null
  } as unknown as OrderItem;

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