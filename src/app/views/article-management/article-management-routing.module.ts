import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "carousel",
    loadComponent: () => import('./carousel-management/carousel-management.component').then(m => m.CarouselManagementComponent),
  },
  {
    path: "aboutus",
    loadComponent: () => import("./about-us/about-us.component").then(m => m.AboutUsComponent),
  },
  {
    path: "news",
    loadComponent: () => import("./news-management/news-management.component").then(m => m.NewsManagementComponent),
  },
  {
    path: "product",
    loadComponent: () => import("./product-management/product-management.component").then(m => m.ProductManagementComponent),
  },
  {
    path: "recruit",
    loadComponent: () => import("./recruit-management/recruit-management.component").then(m => m.RecruitManagementComponent),
  },
  {
    path: "faq",
    loadComponent: () => import("./faq-management/faq-management.component").then(m => m.FaqManagementComponent),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleManagementRoutingModule { }
