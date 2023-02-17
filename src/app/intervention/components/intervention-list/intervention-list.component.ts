import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { InterventionListDataSource } from './intervention-list-datasource';
import { InterventionService } from '../../services/intervenction/intervention.service';
import { FormControl } from '@angular/forms';
import { InterventionType } from '../../models/intervention';
import { UserService } from '../../../user/services/user/user.service';
import { User } from '../../../user/models/user';

@Component({
  selector: 'app-intervention-list',
  templateUrl: './intervention-list.component.html',
  styleUrls: ['./intervention-list.component.scss']
})
export class InterventionListComponent implements OnInit {
  public sortBy = new FormControl<string>('id');
  public isAsc = new FormControl<boolean>(true);
  public filterBy = new FormControl<number|null>(null);
  public filterBy2 = new FormControl<number|null>(null);
  public searchBy = new FormControl<string>('');
  public types:InterventionType[];
  public users:User[];
  dataSource: InterventionListDataSource = new InterventionListDataSource([]);

  constructor(private interventions:InterventionService, private UserService:UserService, private router:RouterService) {

  }

  ngOnInit(): void {
    this.dataSource = new InterventionListDataSource([])
    this.interventions.get().subscribe(
      res => {
        this.dataSource = new InterventionListDataSource(res)
      }
    );
    this.interventions.getTypes().subscribe(
      res=>this.types = res
    )
    this.UserService.get().subscribe(
      res=>this.users = res
    )
  }

  goTo(id:number){
    this.router.navigateTo(`/intervention/${id}`)
  }

  setAsc(asc:boolean){
    this.isAsc.setValue(asc)
  }

  resetFilter(){
    this.filterBy.setValue(null)
  }

  resetFilter2(){
    this.filterBy2.setValue(null)
  }
}
/*
    <!-- Id Column -->
    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Id</th>
      <td mat-cell *matCellDef="let row">{{row.id}}</td>
    </ng-container>

    <!-- Reference Column -->
    <ng-container matColumnDef="reference">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Référence</th>
      <td mat-cell *matCellDef="let row">{{row.reference}}</td>
    </ng-container>

    <!-- Serial Column -->
    <ng-container matColumnDef="serial_number">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Numéro de Série</th>
      <td mat-cell *matCellDef="let row">{{row.serial_number}}</td>
    </ng-container>

    <!-- Unit Column -->
    <ng-container matColumnDef="unit">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Unité</th>
      <td mat-cell *matCellDef="let row">{{row.unit}}</td>
    </ng-container>

    <!-- Room Column -->
    <ng-container matColumnDef="room">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Local</th>
      <td mat-cell *matCellDef="let row">{{row.room}}</td>
    </ng-container>

    <!-- Action Column -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Actions</th>
      <td mat-cell *matCellDef="let row">
        <button (click)="goTo(row.id)" mat-flat-button color="accent">Détails</button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true" ></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
*/