import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { RouterService } from 'src/app/services/router/router.service';
import { Item } from '../../models/item';
import { ItemService } from '../../services/item/item.service';
import { ItemListDataSource } from './item-list-datasource';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  dataSource: ItemListDataSource = new ItemListDataSource([]);

  constructor(private items:ItemService, private router:RouterService) {

  }

  ngOnInit(): void {
    this.dataSource = new ItemListDataSource([])
    this.items.get().subscribe(
      res => {
        this.dataSource = new ItemListDataSource(res)
      }
    );
  }

  goTo(id:number){
    this.router.navigateTo(`/item/${id}`)
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