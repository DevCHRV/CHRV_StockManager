import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../config/AuthInterceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const staticRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: '**', component: NotFoundComponent}
] 
 
@NgModule({
  declarations: [
    NotFoundComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(staticRoutes)
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  exports: [
    NotFoundComponent,
  ]
})
export class StaticModule { }
