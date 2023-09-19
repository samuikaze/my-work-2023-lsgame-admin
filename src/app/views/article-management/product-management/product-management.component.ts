import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorService } from 'src/app/layouts/base/base-navigator/services/navigator.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  constructor(private navigatorService: NavigatorService) {}

  ngOnInit(): void {
    this.navigatorService.setBreadcrumbs(["後台首頁", "作品管理"]);
  }
}
