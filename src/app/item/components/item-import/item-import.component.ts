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
  items?:Item[]
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

@Component({
  selector: 'app-item-import',
  templateUrl: './item-import.component.html',
  styleUrls: ['./item-import.component.scss']
})
export class ItemImportComponent {

  public item_types:ItemTypeMap[] = []
  public items: Item[] = []
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
    for(const item of this.items){
      this.itemService.post(item).subscribe(
        res => this.toast.setSuccess()
      )
    }
    this.router.navigateTo('item')
  }

  public fileChange($event:any){
    this.reset()
    const reader = new FileReader()
    reader.readAsArrayBuffer($event.target.files[0])
    reader.onload = (e) => {
      var workbook = read(reader.result, {type: 'array'});
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      this.csv_items = utils.sheet_to_json(sheet) as CSVItem[];
      this.convertCSVItemsToItems()
      this.mergeItemsAndTypes()
    }
  }

  private convertCSVItemsToItems(){
    for(let item of this.csv_items){
      const type = this.types.find(i=>i.id==item.TYPE_ID)
      if(type == null){
        continue
      }
      else{
        this.items.push({
          id: item.ID,
          description: item.DESCRIPTION,
          checkup_interval: item.CHECKUP_INTERVAL,
          is_available: item.IS_AVAILABLE =="1"?true:false,
          is_placed: item.IS_PLACED =="1"?true:false,
          last_checkup_at: item.LAST_CHECKUP_AT,
          licence: [],
          order: null,
          price: item.PRICE,
          provider: item.PROVIDER,
          reference: item.REFERENCE,
          room:item.ROOM,
          serial_number: item.SERIAL_NUMBER,
          unit:item.UNIT,
          purchased_at: item.PURCHASED_AT,
          received_at:item.RECEIVED_AT,
          warranty_expires_at:item.WARRANTY_EXPIRES_AT,
          type: type
        })
      }
    }
  }

  private mergeItemsAndTypes(){
    for(let type of this.types){
      this.item_types.push({type:type, items:this.items.filter(i=>i.type.id == type.id) })
    }
  }

  private reset(){
    this.item_types = []
    this.items = []
  }
}
