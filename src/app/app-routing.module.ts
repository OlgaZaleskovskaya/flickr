import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NoSuchPageComponent } from './no-such-page/no-such-page.component';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: '/auth' , pathMatch: 'full'},
  { path: 'main', component: MainComponent},
  { path: '**', component: NoSuchPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
