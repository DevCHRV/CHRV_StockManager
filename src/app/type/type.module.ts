import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeCreationComponent } from './components/type-creation/type-creation.component';
import { TypeDetailsComponent } from './components/type-details/type-details.component';
import { TypeListComponent } from './components/type-list/type-list.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../config/AuthInterceptor';
import { LoggedGuard } from '../guards/logged.guard';

const typeRoutes: Routes = [
  {path:'type', component:TypeListComponent, canActivate:[LoggedGuard]},
  {path:'type/create', component:TypeCreationComponent, canActivate:[LoggedGuard]},
  {path:'type/:id', component:TypeDetailsComponent, canActivate:[LoggedGuard]},
]

@NgModule({
  declarations: [
    TypeListComponent,
    TypeCreationComponent,
    TypeDetailsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(typeRoutes)
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  exports : [
    TypeListComponent,
    TypeCreationComponent,
    TypeDetailsComponent,
  ]
})
export class TypeModule { }
