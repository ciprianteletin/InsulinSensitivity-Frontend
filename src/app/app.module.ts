import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterDetailsComponent } from './components/register-details/register-details.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { InsulinFormComponent } from './components/insulin-form/insulin-form.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    RegisterDetailsComponent,
    MainHeaderComponent,
    PrincipalComponent,
    InsulinFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
