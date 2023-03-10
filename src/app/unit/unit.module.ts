import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { UnitDetailsComponent } from './components/unit-details/unit-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PipeModule } from '../pipe/pipe.module';
import { MatIconModule } from '@angular/material/icon';
import { Routes, RouterModule } from '@angular/router';
import { TechnicianGuard } from '../guards/technician/technician.guard';
import { ProgrammerGuard } from '../guards/programmer/programmer.guard';
import { MatButtonModule } from '@angular/material/button';
import { UnitCreationComponent } from './components/unit-creation/unit-creation.component';

const unitRoutes: Routes = [
  {path:'unit', component:UnitListComponent, canActivate:[TechnicianGuard]},
  {path:'unit/create', component:UnitCreationComponent, canActivate:[ProgrammerGuard]},
  {path:'unit/:unit_id', component:UnitDetailsComponent, canActivate:[ProgrammerGuard]},
]    

@NgModule({
  declarations: [
    UnitListComponent,
    UnitDetailsComponent,
    UnitCreationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PipeModule,
    MatIconModule,
    MatButtonModule,
    RouterModule.forChild(unitRoutes),
  ],
  exports: [
    UnitListComponent,
    UnitDetailsComponent,
    UnitCreationComponent,
  ],
})
export class UnitModule { }
