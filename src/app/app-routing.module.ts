import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {IndexComponent} from './components/index/index.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {RegisterDetailsComponent} from './components/register-details/register-details.component';
import {PrincipalComponent} from './components/principal/principal.component';
import {InsulinFormComponent} from './components/insulin-form/insulin-form.component';
import {NotFoundComponent} from './components/not-found/not-found.component';

// TODO add more pages and also error page
const routes: Routes = [
  {path: '', component: IndexComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'register/details', component: RegisterDetailsComponent},
  {path: 'insulin', component: PrincipalComponent},
  {path: 'insulin/calculator', component: InsulinFormComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
