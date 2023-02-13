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

const itemRoutes: Routes = [
  {path:'item', component:ItemListComponent},
  {path:'item/create', component:ItemCreationComponent},
  {path:'item/:id', component:ItemDetailsComponent},
]

@NgModule({
  declarations: [
    ItemListComponent,
    ItemCreationComponent,
    ItemUpdateComponent,
    ItemDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(itemRoutes),
    FormsModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
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
    ItemDetailsComponent
  ]
})
export class ItemModule { }
