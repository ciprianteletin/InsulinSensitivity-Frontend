import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PrincipalComponent} from './components/principal/principal.component';
import {InsulinFormComponent} from './components/insulin-form/insulin-form.component';
import {IndexComponent} from './components/index/index.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptorService} from './interceptors/auth-interceptor.service';
import {ErrorInterceptorService} from './interceptors/error-interceptor.service';
import {NotificationsModule} from './configs/notifications.module';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationModule} from './modules/authentication.module';
import {SharedModule} from './modules/shared.module';
import {ErrorModule} from './modules/error.module';
import {SettingsComponent} from './components/settings/settings.component';
import {FormsModule} from '@angular/forms';
import {CredentialsInterceptor} from './interceptors/credentials.interceptor';
import {AppInitService} from './configs/app-init.service';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';

export function initApp(appInitService: AppInitService): () => Promise<any> {
  return () => appInitService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    InsulinFormComponent,
    IndexComponent,
    SidebarComponent,
    SettingsComponent,
    DeleteModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthenticationModule,
    ErrorModule,
    SharedModule,
    FormsModule,
    NotificationsModule
  ],
  providers: [
    AppInitService,
    {provide: APP_INITIALIZER, useFactory: initApp, deps: [AppInitService], multi: true},
    CookieService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: CredentialsInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
