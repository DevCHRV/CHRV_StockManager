import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InterventionCreationComponent } from './components/intervention-creation/intervention-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { InterventionListComponent } from './components/intervention-list/intervention-list.component';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { PipeModule } from '../pipe/pipe.module';
import { InterventionDetailsComponent } from './components/intervention-details/intervention-details.component';
import { LoggedGuard } from '../guards/logged/logged.guard';
import { TechnicianGuard } from '../guards/technician/technician.guard';

const interventionRoutes: Routes = [
  {path:'intervention', component:InterventionListComponent, canActivate:[TechnicianGuard]},
  {path:'intervention/create/:item_id', component:InterventionCreationComponent, canActivate:[TechnicianGuard]},
  //{path:'item/create', component:ItemCreationComponent, canActivate:[LoggedGuard]},
  {path:'intervention/:intervention_id', component:InterventionDetailsComponent, canActivate:[TechnicianGuard]},
]    

@NgModule({
  declarations: [
    InterventionCreationComponent,
    InterventionListComponent,
    InterventionDetailsComponent,
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
    RouterModule.forChild(interventionRoutes),
    CommonModule,
    MatNativeDateModule,
  ],
  exports: [
    InterventionCreationComponent,
    InterventionListComponent,
    InterventionDetailsComponent
  ]
})
export class InterventionModule { }
