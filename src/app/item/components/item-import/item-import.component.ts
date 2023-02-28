import { Component, ViewChild } from '@angular/core';
import { ItemType } from 'src/app/type/models/type';
import { Item } from '../../models/item';
import { LoaderService } from '../../../services/loader/loader.service';
import { ToastService } from '../../../services/toast/toast.service';
import { read, utils, writeFile } from 'xlsx';
import { ItemTypeService } from 'src/app/type/services/type/type.service';
import { ItemService } from '../../services/item/item.service';
import { RouterService } from '../../../services/router/router.service';

/*
import { set_cptable } from "xlsx";
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
import { ItemTypeService } from '../../../type/services/type/type.service';
import { ItemService } from '../../services/item/item.service';
set_cptable(cptable);
*/

export interface ItemTypeMap{
  type:ItemType, 
  items?:ItemFromCSV[]
}

export interface CSVItem{
  ID:number,
  REFERENCE:string,
  SERIAL_NUMBER:string,
  DESCRIPTION:string,
  PRICE:number,
  RECEIVED_AT?:Date,
  PURCHASED_AT?:Date,
  WARRANTY_EXPIRES_AT?:Date,
  TYPE_ID:number,
  IS_AVAILABLE:string,
  IS_PLACED?:string,
  UNIT:string,
  ROOM:string,
  LAST_CHECKUP_AT:Date,
  CHECKUP_INTERVAL:number,
  PROVIDER:string
}

export interface ItemFromCSV {
  id:number,
  reference:string,
  serial_number:string,
  description:string,
  price:number,
  received_at?:Date,
  purchased_at?:Date,
  warranty_expires_at?:Date,
  type:ItemType,
  is_available:boolean,
  is_placed?:boolean,
  unit:string,
  room:string,
  last_checkup_at:Date,
  checkup_interval:number,
  provider:string
  is_valid:boolean
}

@Component({
  selector: 'app-item-import',
  templateUrl: './item-import.component.html',
  styleUrls: ['./item-import.component.scss']
})
export class ItemImportComponent {

  public item_types:ItemTypeMap[] = []
  public items: ItemFromCSV[] = []
  private csv_items: CSVItem[] = []
  public types:ItemType[] = []
  
  @ViewChild('csvInput') fileImportInput: any;

  constructor(private toast:ToastService, private loader:LoaderService, private typeService:ItemTypeService, private itemService:ItemService, private router:RouterService){}

  ngOnInit(){
    this.typeService.get().subscribe(
      res =>{
        this.types = res
      } 
    )
  }

  public post(){
    for(const item of this._getValidItems()){
      this.itemService.post(item as unknown as Item).subscribe(
        res => this.toast.setSuccess()
      )
    }
    this.router.navigateTo('item')
  }

  public fileChange($event:any){
    this._reset()
    const reader = new FileReader()
    reader.readAsArrayBuffer($event.target.files[0])
    reader.onload = (e) => {
      var workbook = read(reader.result, {type: 'array'});
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      this.csv_items = utils.sheet_to_json(sheet) as CSVItem[];
      this.convertCSVItemsToItems()
      this._mergeItemsAndTypes()
      this._verifyItems()
    }
  }

  private convertCSVItemsToItems(){
    for(let item of this.csv_items){
      let valid = true
      let type = this.types.find(i=>i.id==item.TYPE_ID)
      if(!this._verifyCSVItem(item)){
        valid = false
        type = {id:-1} as unknown as ItemType
        this.toast.setError("Certaines entrées étaient invalides. Elles ne seront pas importées.")
      }
      this.items.push({
        id: item.ID,
        description: item.DESCRIPTION,
        checkup_interval: item.CHECKUP_INTERVAL,
        is_available: item.IS_AVAILABLE =="1"?true:false,
        is_placed: item.IS_PLACED =="1"?true:false,
        last_checkup_at: item.LAST_CHECKUP_AT,
        price: item.PRICE,
        provider: item.PROVIDER,
        reference: item.REFERENCE,
        room:item.ROOM,
        serial_number: item.SERIAL_NUMBER,
        unit:item.UNIT,
        purchased_at: item.PURCHASED_AT,
        received_at:item.RECEIVED_AT,
        warranty_expires_at:item.WARRANTY_EXPIRES_AT,
        type: type,
        is_valid: valid
      } as ItemFromCSV)
    }
  }

  private _getValidItems(){
    return this.items.filter(i=>i.is_valid)
  }

  private _verifyCSVItem(item:CSVItem){
    if(!item.SERIAL_NUMBER || !item.REFERENCE || !item.DESCRIPTION || !item.PURCHASED_AT || !item.WARRANTY_EXPIRES_AT || !item.TYPE_ID){
      return false
    }
    return true
  }

  private _verifyItem(item:ItemFromCSV){
    if(!item.serial_number || !item.reference || !item.description || !item.purchased_at || !item.warranty_expires_at || !item.type){
      item.is_valid = false
      return false
    }
    return true
  }

  private _verifyItems(){
    for(let i of this.items){
      this._verifyItem(i)
    }
  }

  private _mergeItemsAndTypes(){
    for(let type of this.types){
      this.item_types.push({type:type, items:this.items.filter(i=>{
        return i.type.id == type.id}) })
    }
    const invalid_items= this.items.filter(i=>i.is_valid==false)
    this.item_types.push({type: {id:-1, name:"Invalides", description:"Entrées invalides", totalQuantity:invalid_items.length, availableQuantity: invalid_items.length, expected_lifetime:0}, items: invalid_items})
  }

  private _reset(){
    this.item_types = []
    this.items = []
  }
}
