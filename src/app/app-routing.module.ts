import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './components/index/index.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {RegisterDetailsComponent} from './components/register-details/register-details.component';
import {PrincipalComponent} from './components/principal/principal.component';
import {InsulinFormComponent} from './components/insulin-form/insulin-form.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';
import {MailComponent} from './components/mail-component/mail-component';
import {CanDeactivateGuard} from './guards/can-deactivate.guard';
import {SettingsComponent} from './components/settings/settings.component';
import {DetailedUserResolver} from './resolver/detailed-user.resolver';
import {CountryResolver} from './resolver/country.resolver';

const routes: Routes = [
  {path: '', component: IndexComponent, pathMatch: 'full'},
  {
    path: 'login', component: LoginComponent, canDeactivate: [CanDeactivateGuard], children: [
      {path: 'forget', component: MailComponent}
    ]
  },
  {path: 'register', component: RegisterComponent, canDeactivate: [CanDeactivateGuard]},
  {path: 'register/details', component: RegisterDetailsComponent, canDeactivate: [CanDeactivateGuard]},
  {
    path: 'settings', component: SettingsComponent, resolve: {
      detailedUser: DetailedUserResolver,
      country: CountryResolver
    }
  },
  {path: 'insulin', component: PrincipalComponent},
  // TODO add canDeactivate to insulin calc.
  {
    path: 'insulin/calculator', component: InsulinFormComponent, resolve: {
      detailedUser: DetailedUserResolver
    }
  },
  {path: 'resetPassword/:code', component: ResetPasswordComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
