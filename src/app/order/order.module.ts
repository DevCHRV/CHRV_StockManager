import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCreationComponent, Modal } from './components/order-creation/order-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../pipe/pipe.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog'
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import {MatTreeModule} from '@angular/material/tree'
import { MatExpansionModule } from '@angular/material/expansion';
import { LoggedGuard } from '../guards/logged/logged.guard';
import { ProgrammerGuard } from '../guards/programmer/programmer.guard';

const orderRoutes: Routes = [
  {path:'order', component:OrderListComponent, canActivate:[ProgrammerGuard]},
  {path:'order/create', component:OrderCreationComponent, canActivate:[ProgrammerGuard]},
  //{path:'item/create', component:ItemCreationComponent, canActivate:[LoggedGuard]},
  {path:'order/:order_id', component:OrderDetailsComponent, canActivate:[ProgrammerGuard]},
]    

@NgModule({
  declarations: [
    OrderCreationComponent,
    OrderListComponent,
    OrderDetailsComponent,
    Modal,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PipeModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule.forChild(orderRoutes),
    CommonModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTreeModule,
  ],
  exports:[
    OrderCreationComponent,
    OrderListComponent,
    OrderDetailsComponent,
    Modal,
  ]
})
export class OrderModule { }
