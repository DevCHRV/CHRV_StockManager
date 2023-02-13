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

const licenceRoutes: Routes = [
  {path:'licence', component:LicenceListComponent},
  {path:'licence/create', component:LicenceCreationComponent},
  {path:'licence/:id', component:LicenceDetailsComponent},
]

@NgModule({
  declarations: [
    LicenceListComponent,
    LicenceDetailsComponent,
    LicenceCreationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(licenceRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
  ],
  exports: [
    LicenceListComponent,
    LicenceDetailsComponent,
    LicenceCreationComponent,
  ]
})
export class LicenceModule { }
