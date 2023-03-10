import { AfterViewInit, Component, ViewChild, OnInit, Pipe, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item/item.service';
import { ItemListDataSource } from './itemQR-list-datasource';
import { FormControl } from '@angular/forms';
import { tap, filter } from 'rxjs';
import { ItemTypeService } from '../../../type/services/type/type.service';
import * as moment from 'moment';
import { ItemType } from '../../../type/models/type';
import { Capacitor } from '@capacitor/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-itemQR-list',
  templateUrl: './itemQR-list.component.html',
  styleUrls: ['./itemQR-list.component.scss']
})
export class ItemQRListComponent implements OnInit {

  dataSource: ItemListDataSource = new ItemListDataSource([]);

  @ViewChild('pdfContainer', {read: ElementRef, static:false}) pdfRef: ElementRef

  constructor(private items:ItemService, private typeService:ItemTypeService, private router:RouterService) {
    this.dataSource = new ItemListDataSource(items.getSelected())
  }

  ngOnInit(): void {

  }

  getQRCodeUrl(item:Item){
    return `${item.id}`
  }

  isMobile(){
    return Capacitor.getPlatform()!="web"
  }

  getAsPdf(){    
    let data = this.pdfRef.nativeElement
    //We genereate the PDF
    this.generatePDF(data)
  }

  //For the love of god, please don't touch this.
  generatePDF(data: any) {
    //To ensure that the page looks good we need to resize it to a fixed size
    //For some reason, doing it inside the onclone method of html2canvas doesn't work
    data.style.width="1100px"
    //We use a small timeout to ensure that the page changes had enough time to process, otherwise it would not work consistently
    setTimeout(()=>{
      html2canvas(data, {scale:2, scrollY:-window.scrollY}).then((canvas) => {
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
        //We download the file
        const blob = pdf.output('blob')
        window.open(URL.createObjectURL(blob))
        //pdf.output('dataurlnewwindow', {filename:`item_qrs_${Date.now()}.pdf`})
        //pdf.save(`item_qrs_${Date.now()}.pdf`)
      });
    }, 200)
  }
}