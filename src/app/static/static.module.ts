import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../config/AuthInterceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoggedGuard } from '../guards/logged/logged.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const staticRoutes: Routes = [
  {path: '', component: DashboardComponent, canActivate:[LoggedGuard]},
  {path: '**', component: NotFoundComponent}
] 
 
@NgModule({
  declarations: [
    NotFoundComponent,
    DashboardComponent,
    HeaderComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(staticRoutes),
    FormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,  
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
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
    NotFoundComponent,
    DashboardComponent,
    HeaderComponent,
  ]
})
export class StaticModule { }
