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
  licences?:LicenceFromCSV[]
}

export interface CSVLicence{
  ID: number,
  DESCRIPTION: string,
  VALUE: string
  ITEM_ID: number,
  USER_ID: number,
  TYPE_ID: number,
}

export interface LicenceFromCSV{
  id:number,
  description:string,
  value:string,
  user:IUser|null,
  type:LicenceType,
  is_valid:boolean,
}

@Component({
  selector: 'app-licence-import',
  templateUrl: './licence-import.component.html',
  styleUrls: ['./licence-import.component.scss']
})
export class LicenceImportComponent {

  public licence_types:LicenceTypeMap[] = []
  public licences: LicenceFromCSV[] = []
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
    for(const licence of this._getValidLicences()){
      this.licenceService.post(licence as unknown as Licence).subscribe(
        res => this.toast.setSuccess()
      )
    }
    this.router.navigateTo('licence')
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
      let valid = true
      let type = this.types.find(i=>i.id==licence.TYPE_ID)
      if(!this._verifyCSVLicence(licence)){
        valid = false
        type = {id:-1, name:"Invalides"}
        this.toast.setError("Certaines entrées étaient invalides. Elles ne seront pas importées.")
      }
      this.licences.push({
        id: licence.ID,
        description: licence.DESCRIPTION,
        value: licence.VALUE,
        user: null,
        type: type,
        is_valid: valid
      } as LicenceFromCSV)
    }
  }

  private mergeItemsAndTypes(){
    for(let type of this.types){
      this.licence_types.push({type:type, licences:this.licences.filter(i=>i.type.id == type.id) })
    }
    const invalid_licences= this.licences.filter(i=>i.is_valid==false)
    this.licence_types.push({type: {id:-1, name:"Invalides"}, licences: invalid_licences})
 
  }

  private _getValidLicences(){
    return this.licences.filter(i=>i.is_valid)
  }

  private _verifyCSVLicence(licence:CSVLicence){
    if(!licence.VALUE || !licence.DESCRIPTION || !licence.TYPE_ID){
      return false
    }
    return true
  }

  private _verifyItem(licence:LicenceFromCSV){
    if(!licence.description || !licence.value || !licence.type){
      licence.is_valid = false
      return false
    }
    return true
  }

  private reset(){
    this.licence_types = []
    this.licences = []
  }
}
