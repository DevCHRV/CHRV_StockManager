import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { LicenceListDataSource } from './licence-list-datasource';
import { LicenceService } from '../../services/licence/licence.service';

@Component({
  selector: 'app-licence-list',
  templateUrl: './licence-list.component.html',
  styleUrls: ['./licence-list.component.scss']
})
export class LicenceListComponent implements OnInit {

  dataSource: LicenceListDataSource= new LicenceListDataSource([]);

  constructor(private licences:LicenceService, private router:RouterService) {

  }

  ngOnInit(): void {
    this.dataSource = new LicenceListDataSource([])
    this.licences.get().subscribe(
      res => {
        this.dataSource = new LicenceListDataSource(res)
      }
    );
  }

  goTo(id:number){
    this.router.navigateTo(`/licence/${id}`)
  }
}