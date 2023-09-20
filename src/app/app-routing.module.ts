import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { checkAuthenticateGuard } from './guards/check-authenticate.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [checkAuthenticateGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'article',
        loadChildren: () =>
          import(
            './views/article-management/article-management-routing.module'
          ).then((m) => m.ArticleManagementRoutingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
