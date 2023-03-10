import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemCreationComponent } from './components/item-creation/item-creation.component';
import { ItemUpdateComponent } from './components/item-update/item-update.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../config/AuthInterceptor';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { QRCodeModule } from 'angularx-qrcode';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../pipe/pipe.module';
import {MatExpansionModule} from '@angular/material/expansion'
import { MatCard, MatCardModule } from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ItemImportComponent } from './components/item-import/item-import.component'
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { LoggedGuard } from '../guards/logged/logged.guard';
import { ProgrammerGuard } from '../guards/programmer/programmer.guard';
import { TechnicianGuard } from '../guards/technician/technician.guard';
import { ItemQRListComponent } from './components/itemQR-list/itemQR-list.component';

const itemRoutes: Routes = [
  {path:'item', component:ItemListComponent, canActivate:[ProgrammerGuard]},
  {path:'item/create', component:ItemCreationComponent, canActivate:[ProgrammerGuard]},
  {path:'item/import', component:ItemImportComponent, canActivate:[ProgrammerGuard]},
  {path:'item/qr', component:ItemQRListComponent, canActivate:[TechnicianGuard]},
  {path:'item/:id', component:ItemDetailsComponent, canActivate:[TechnicianGuard]},
]

@NgModule({
  declarations: [
    ItemListComponent,
    ItemCreationComponent,
    ItemUpdateComponent,
    ItemDetailsComponent,
    ItemImportComponent,
    ItemQRListComponent,
  ],
  imports: [
    CommonModule,
    PipeModule,
    RouterModule.forChild(itemRoutes),
    FormsModule,
    MatIconModule,
    MatSortModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatDividerModule,
    QRCodeModule,
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  exports: [
    ItemListComponent,
    ItemCreationComponent,
    ItemUpdateComponent,
    ItemDetailsComponent,
    ItemImportComponent,
    ItemQRListComponent,
  ]
})
export class ItemModule { }
