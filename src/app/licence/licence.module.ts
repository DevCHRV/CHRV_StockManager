import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { LicenceListComponent } from './components/licence-list/licence-list.component';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { LicenceDetailsComponent } from './components/licence-details/licence-details.component';
import { LicenceCreationComponent } from './components/licence-creation/licence-creation.component';
import { PipeModule } from '../pipe/pipe.module';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { LicenceImportComponent } from './components/licence-import/licence-import.component';
import { LoggedGuard } from '../guards/logged/logged.guard';
import { ProgrammerGuard } from '../guards/programmer/programmer.guard';
import { TechnicianGuard } from '../guards/technician/technician.guard';

const licenceRoutes: Routes = [
  {path:'licence', component:LicenceListComponent, canActivate:[ProgrammerGuard]},
  {path:'licence/create', component:LicenceCreationComponent, canActivate:[ProgrammerGuard]},
  {path:'licence/import', component:LicenceImportComponent, canActivate:[ProgrammerGuard]},
  {path:'licence/:id', component:LicenceDetailsComponent, canActivate:[TechnicianGuard]},
]

@NgModule({
  declarations: [
    LicenceListComponent,
    LicenceDetailsComponent,
    LicenceCreationComponent,
    LicenceImportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(licenceRoutes),
    FormsModule,
    PipeModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatExpansionModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
  ],
  exports: [
    LicenceListComponent,
    LicenceDetailsComponent,
    LicenceCreationComponent,
    LicenceImportComponent,
  ]
})
export class LicenceModule { }
