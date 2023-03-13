import { environment } from 'src/environments/environment';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, startWith, Observable, of, filter, catchError } from 'rxjs';
import { RouterService } from 'src/app/services/router/router.service';
import { ItemType } from 'src/app/type/models/type';
import { ItemTypeService } from 'src/app/type/services/type/type.service';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item/item.service';
import { FormControl } from '@angular/forms';
import { Licence } from '../../../licence/models/licences';
import { LicenceService } from '../../../licence/services/licence/licence.service';
import { IUser } from '../../../user/models/user';
import { UserService } from '../../../user/services/user/user.service';
import { ToastService } from '../../../services/toast/toast.service';
import { Intervention } from '../../../intervention/models/intervention';
import { InterventionService } from '../../../intervention/services/intervenction/intervention.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CanvasRenderer } from 'html2canvas/dist/types/render/canvas/canvas-renderer';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { Capacitor, Plugin } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { FileOpener } from '@capacitor-community/file-opener';
import { Filesystem, Directory } from '@capacitor/filesystem';
import write_blob from "capacitor-blob-writer";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent {
  public item:Item;
  public itemLicences:Licence[];
  public types:ItemType[];
  public licences:Licence[];
  public interventions:Intervention[];
  public users:IUser[];
  public is_locked:boolean = true;
  public is_printing:boolean = false;
  public filteredLicenceOptions:Observable<Licence[]>;
  public filteredUserOptions:Observable<IUser[]>;
  public searchLicenceSelect = new FormControl<string>('---');
  public searchUserSelect = new FormControl<string>('---');
  @ViewChild('pdfContainer', {read: ElementRef, static:false}) pdfRef: ElementRef

  constructor(private toast:ToastService, private service:ItemService, private interventionService:InterventionService, private typeService:ItemTypeService, private licenceService:LicenceService, private userService:UserService, private router:RouterService, private route:ActivatedRoute, public auth:AuthService){
    this.load()
  }

  ngOnInit(){
    this.filterOptions()
  }

  getQRCodeUrl(){
    //    return `${environment.appUrl}item/${this.item.id}`
    return `${this.item.id}`
  }

  getAsPdf(){    
    let data = this.pdfRef.nativeElement
    //We genereate the PDF
    this.generatePDF(data)
  }

  //For the love of god, please don't touch this.
  generatePDF(data: any) {
    //We lock the page to make all buttons disappear
    this.is_locked = true
    this.is_printing = true
    //To ensure that the page looks good we need to resize it to a fixed size
    //For some reason, doing it inside the onclone method of html2canvas doesn't work
    data.style.width="1100px"
    //We use a small timeout to ensure that the page changes had enough time to process, otherwise it would not work consistently
    setTimeout(()=>{
      html2canvas(data, {scale:2, scrollY:-window.scrollY}).then(async (canvas) => {
        //We do weird voodoo magic
        let HTML_Width = canvas.width;
        let HTML_Height = canvas.height;
        let top_left_margin = 15;
        let PDF_Width = HTML_Width + (top_left_margin * 2);
        let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
        let canvas_image_width = HTML_Width;
        let canvas_image_height = HTML_Height;
        let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
        canvas.getContext('2d');
        let imgData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
        pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
        for (let i = 1; i <= totalPDFPages; i++) {
          pdf.addPage([PDF_Width, PDF_Height], 'p');
          pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
        }
        //We revert the changes on the page to change it make to normal
        data.style.width="100%"
        this.is_printing = false
        //We download the file
        const blob = pdf.output('blob')
        if(Capacitor.getPlatform()=="web"){
          window.open(URL.createObjectURL(blob))
        }else {
          //Write the file in the cache so that it can be openend on a mobile device
          const file = await write_blob({
            path: `item_${this.item.id}.pdf`,
            directory: Directory.Cache,
            blob: blob
          })
          //Get the uri from Capacitor (otherwise he will not like the uri we give him)
          const result = await Filesystem.getUri({
            path: `item_${this.item.id}.pdf`,
            directory: Directory.Cache,
          })
          //Open the file using FileOpener2 because for some reason the buildt-in CapacitorBrowser would crash
          FileOpener.open({filePath:result.uri, contentType:"application/pdf"})
        }
        //pdf.output('dataurlnewwindow', {filename:`item_${this.item.id}.pdf`})
        //pdf.save(`item_${this.item.id}.pdf`)
      });
    }, 200)
  }

  private convertBlobtoBase64 = (blob:Blob) => new Promise((resolve, reject)=>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader;onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })

  /*
  generatePDF(data: any) {
    data.style.width="1100px"
    html2canvas(data, {scale:2, scrollY:-window.scrollY}).then((canvas) => {
      let width = 190 //Max A4 page width
      let height = (canvas.height*width)/canvas.width
      const url = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4') //We want the pdf to be 'portrait' and the widt/height to be calculated in milimeters and the page format to be A4
      pdf.addImage(url, 'PNG', 10, 10, width, height, 'NONE')
      pdf.save(`item_${this.item.id}.pdf`)
      data.style.width="100%"
    });
  }
  */

  addLicence(){
    const licenceValue = this.searchLicenceSelect.value
    if(typeof(licenceValue)=="string")
      return
    const userValue = this.searchUserSelect.value
    if(typeof(userValue)=="string"&&!userValue)
      return
    const licence = this.licences.find(l=>l.id==licenceValue)
    //Little trick to force js to assign a number instead of an object
    //So that the back-end is happy and there are no parsing errors (in theory)
    licence!.item = this.item.id as unknown as Item
    const user = this.users.find(l=>l.id==parseInt(userValue!))
    licence!.user = user ? user : null
    licence && this.item.licence.push(licence)
    this.resetInputs()
  }

  resetInputs(){
    this.searchLicenceSelect.setValue('---')
    this.searchUserSelect.setValue('---')
  }

  removeLicence(id:number){
    const licence = this.item.licence.find(l=>l.id==id)
      licence!.item = null
    this.itemLicences = this.itemLicences.filter(l=>l.id!=id)
  }

  removeUserFromLicence(id:number){
    const licence = this.item.licence.find(l=>l.id==id)
      licence!.user = null
  }

  toggleLock(){
    this.is_locked = !this.is_locked
  }

  toggleAvailability(){
    if(this.is_locked)
      return;
    if(this.item.isPlaced)
      return;
    this.item.isAvailable = !this.item.isAvailable
  }

  togglePlacement(){
    if(this.is_locked)
      return;
    if(!this.item.isAvailable&&!this.item.isPlaced)
      return
    if(this.item.isPlaced){
      this.item.isPlaced = false
      this.item.isAvailable = true
    }else{
      this.item.isPlaced = true
      this.item.isAvailable = false
    }
  }

  load(){
    //We get Item first so that the page display quickly
    this.service.getById(this.route.snapshot.paramMap.get('id')!).subscribe(
      res=>{
        this.item = res
        this.interventions = res.interventions
        this.itemLicences = res.licence
      })
      this.typeService.get().subscribe(
        res=>this.types = res
      )
    //Then we fetch what is needed to populate the rest
    /*
    this.userService.get().subscribe(
      res => {
        this.users = res
      }
    )
    */
    /*
    this.licenceService.get().subscribe(
      res=>{
        this.licences = res
        this.typeService.get().subscribe(
          res=>{
            this.types = res
          }
        )
      }
    )
    */
  }

  put(){
    this.service.put(this.item)
    .pipe(
      catchError(err=>{
        this.load()
        return of()
      })
    )
    .subscribe(
      res => {
        this.is_locked=true
        this.toast.setSuccess()
      }
    )
  }

  getLicenceDescription(id:number){
    const tmp = this.licences.find(l=>l.id==id)
    return tmp ? tmp.description : ''
  }

  getUserDisplay(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? `${tmp.username}`: ''
  }

  filterOptions(){
    this.filterUserOptions()
    this.filterLicenceOptions()
  }

  filterUserOptions(){
    this.filteredUserOptions = this.searchUserSelect.valueChanges.pipe(
      startWith(''),
      map(value =>this._filterUser(value!||-1)))
  }

  filterLicenceOptions(){
    this.filteredLicenceOptions = this.searchLicenceSelect.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLicence(value!||-1)
      .filter(l=>!this.item.licence.map(l=>l.id).includes(l.id))))
  }

  isMobile(){
    return Capacitor.getPlatform()!="web"
  }

  private _filterLicence(value: number|string): Licence[] {
    return typeof(value)=="string" ? this._doFilterLicenceString(`${value}`)
      :this._doFilterLicenceInt(value)
  }

  private _doFilterLicenceInt(id:number){
    const tmp = this.licences.find(l=>l.id==id)
    return tmp ? this.licences.filter(l=>l.description==tmp.description):this.licences
  }

  private _doFilterLicenceString(input:string){
    return this.licences.filter(l=>l.description.toLowerCase().includes(input))
  }

  private _filterUser(value: number|string): IUser[] {
    return typeof(value)=="string" ? this._doFilterUserString(`${value}`)
      :this._doFilterUserInt(value)
  }

  private _doFilterUserInt(id:number){
    const tmp = this.users.find(u=>u.id==id)
    return tmp ? this.users.filter(u=>u.id==tmp.id):this.users
  }

  private _doFilterUserString(input:string){
    return this.users.filter(u=>`${u.username}${u.firstname}${u.lastname}`.toLowerCase().includes(input))
  }

  goToInterventionCreation(){
    this.router.navigateTo(`intervention/create/${this.item.id}`)
  }

  goToIntervention(intervention:Intervention){
    this.router.navigateTo(`intervention/${intervention.id}`)
  }

  generateTicket(intervention:Intervention){
    this.interventionService.generateTicket(intervention).subscribe(
      res => this.toast.setSuccess("Le mail à bien été envoyé, la création du ticket peut prendre quelques minutes.")
    );
  }
}
