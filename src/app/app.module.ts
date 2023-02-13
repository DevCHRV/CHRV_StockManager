import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemModule } from './item/item.module';
import { StaticModule } from './static/static.module';
import { TypeModule } from './type/type.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card'; 
import { HeaderComponent } from './components/header/header.component';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './config/AuthInterceptor';
import { LicenceModule } from './licence/licence.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    TypeModule,
    ItemModule,
    LicenceModule,
    HttpClientModule,

    //IMPORTANT: LEAVE THE STATIC MODULE AFTER THE OTHER APP MODULES OR IT WILL OVERRIDE OTHER MODULES' ROUTES
    StaticModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,  
    MatListModule,  
    MatCardModule,
    FormsModule,
  ],
  exports:[
    HttpClientModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
