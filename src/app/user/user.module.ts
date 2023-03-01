import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { AdminGuard } from '../guards/admin/admin.guard';
import { Routes, RouterModule } from '@angular/router';
import { PipeModule } from '../pipe/pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const userRoutes: Routes = [
  {path:'user', component:UserListComponent, canActivate:[AdminGuard]},
  {path: 'user/:user_id', component:UserDetailsComponent, canActivate:[AdminGuard]}
]


@NgModule({
  declarations: [
    UserListComponent,
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    PipeModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    RouterModule.forChild(userRoutes),
  ],
  exports: [
    UserListComponent,
  ]
})
export class UserModule { }
