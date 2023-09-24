import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "product",
    loadComponent: () => import("./product-management/product-management.component").then(m => m.ProductManagementComponent),
  },
  {
    path: "type",
    loadComponent: () => import("./product-type-management/product-type-management.component").then(m => m.ProductTypeManagementComponent),
  },
  {
    path: "platform",
    loadComponent: () => import("./product-platform-management/product-platform-management.component").then(m => m.ProductPlatformManagementComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagementRoutingModule { }
