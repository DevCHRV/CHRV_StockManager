import { Component, ViewChild } from '@angular/core';
import { ItemType } from 'src/app/type/models/type';
import { LoaderService } from '../../../services/loader/loader.service';
import { ToastService } from '../../../services/toast/toast.service';
import { read, utils, writeFile } from 'xlsx';
import { ItemTypeService } from 'src/app/type/services/type/type.service';
import { RouterService } from '../../../services/router/router.service';
import { Licence, LicenceType } from '../../models/licences';
import { LicenceService } from '../../services/licence/licence.service';
import { LicenceTypeService } from '../../services/type/type.service';
import { IUser } from '../../../user/models/user';
import { Item } from '../../../item/models/item';

export interface LicenceTypeMap{
  type:LicenceType, 
  licences?:Licence[]
}

export interface CSVLicence{
  ID: number,
  DESCRIPTION: string,
  VALUE: string
  ITEM_ID: number,
  USER_ID: number,
  TYPE_ID: number,
}

@Component({
  selector: 'app-licence-import',
  templateUrl: './licence-import.component.html',
  styleUrls: ['./licence-import.component.scss']
})
export class LicenceImportComponent {

  public licence_types:LicenceTypeMap[] = []
  public licences: Licence[] = []
  private csv_licences: CSVLicence[] = []
  public types:LicenceType[] = []
  
  @ViewChild('csvInput') fileImportInput: any;

  constructor(private toast:ToastService, private loader:LoaderService, private typeService:LicenceTypeService, private licenceService:LicenceService, private router:RouterService){}

  ngOnInit(){
    this.typeService.get().subscribe(
      res =>{
        this.types = res
      } 
    )
  }

  public post(){
    for(const item of this.licences){
      this.licenceService.post(item).subscribe(
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
      this.csv_licences = utils.sheet_to_json(sheet) as CSVLicence[];
      this.convertCSVItemsToItems()
      this.mergeItemsAndTypes()
    }
  }

  private convertCSVItemsToItems(){
    for(let licence of this.csv_licences){
      const type = this.types.find(i=>i.id==licence.TYPE_ID)
      if(type == null){
        continue
      }
      else{
        this.licences.push({
          id: licence.ID,
          description: licence.DESCRIPTION,
          value: licence.VALUE,
          item: null,
          user: null,
          type: type
        })
      }
    }
  }

  private mergeItemsAndTypes(){
    for(let type of this.types){
      this.licence_types.push({type:type, licences:this.licences.filter(i=>i.type.id == type.id) })
    }
  }

  private reset(){
    this.licence_types = []
    this.licences = []
  }
}
