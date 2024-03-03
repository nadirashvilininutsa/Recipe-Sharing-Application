import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NewRecipeComponent } from './main/new-recipe/new-recipe.component';
import { AnonymGuard } from './guards/anonym.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
  },
  {
    path: 'new-recipe',
    component: NewRecipeComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [AnonymGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    // canActivate: [AnonymGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
