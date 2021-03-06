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
import {ResultComponent} from './components/result/result.component';
import {HistoryComponent} from './components/history/history.component';
import {SummaryResolver} from './resolver/summary.resolver';
import {LoggedInGuard} from './guards/logged-in.guard';
import {NotLoggedGuard} from './guards/not-logged.guard';
import {ContactUsComponent} from './components/contact-us/contact-us.component';
import {PredictDiabetesComponent} from './components/predict-diabetes/predict-diabetes.component';
import {PredictEvolutionComponent} from './components/predict-evolution/predict-evolution.component';

const routes: Routes = [
  {path: '', component: IndexComponent, pathMatch: 'full'},
  {
    path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard], canDeactivate: [CanDeactivateGuard], children: [
      {path: 'forget', component: MailComponent}
    ]
  },
  {path: 'register', component: RegisterComponent, canActivate: [NotLoggedGuard], canDeactivate: [CanDeactivateGuard]},
  {path: 'register/details', component: RegisterDetailsComponent, canDeactivate: [CanDeactivateGuard]},
  {
    path: 'settings', component: SettingsComponent, canActivate: [LoggedInGuard], resolve: {
      detailedUser: DetailedUserResolver,
      country: CountryResolver
    }
  },
  {path: 'insulin', component: PrincipalComponent},
  {
    path: 'insulin/calculator', component: InsulinFormComponent, canDeactivate: [CanDeactivateGuard],
    resolve: {
      detailedUser: DetailedUserResolver
    }
  },
  {
    path: 'predict/diabetes', component: PredictDiabetesComponent, canActivate: [LoggedInGuard], canDeactivate: [CanDeactivateGuard],
    resolve: {
      detailedUser: DetailedUserResolver
    }
  },
  {
    path: 'predict/evolution', component: PredictEvolutionComponent, canActivate: [LoggedInGuard], canDeactivate: [CanDeactivateGuard],
    resolve: {
      detailedUser: DetailedUserResolver
    }
  },
  {path: 'results', component: ResultComponent, canDeactivate: [CanDeactivateGuard]},
  {
    path: 'history', component: HistoryComponent, canActivate: [LoggedInGuard], resolve: {
      summary: SummaryResolver
    }
  },
  {
    path: 'contact-us', component: ContactUsComponent, resolve: {
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
