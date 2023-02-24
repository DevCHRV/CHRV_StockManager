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
import { LoggedGuard } from '../guards/logged.guard';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../pipe/pipe.module';
import {MatExpansionModule} from '@angular/material/expansion'
import { MatCard, MatCardModule } from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';
import { ItemImportComponent } from './components/item-import/item-import.component'
import { MatDivider, MatDividerModule } from '@angular/material/divider';

const itemRoutes: Routes = [
  {path:'item', component:ItemListComponent, canActivate:[LoggedGuard]},
  {path:'item/create', component:ItemCreationComponent, canActivate:[LoggedGuard]},
  {path:'item/import', component:ItemImportComponent, canActivate:[LoggedGuard]},
  {path:'item/:id', component:ItemDetailsComponent, canActivate:[LoggedGuard]},
]

@NgModule({
  declarations: [
    ItemListComponent,
    ItemCreationComponent,
    ItemUpdateComponent,
    ItemDetailsComponent,
    ItemImportComponent,
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
  ]
})
export class ItemModule { }
