import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { UserTypeComponent } from './components/user-type/user-type.component';
import { AddChantComponent } from './components/add-chant/add-chant.component';
import { HomeComponent } from './components/home/home.component';
import { CreateUsernameComponent } from './components/create-username/create-username.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'user-type', component: UserTypeComponent },
  { path: 'create-username', component: CreateUsernameComponent },
  { path: 'add-chant', component: AddChantComponent },
  { path: 'home', component: HomeComponent }, // Keep old home route for backward compatibility
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
