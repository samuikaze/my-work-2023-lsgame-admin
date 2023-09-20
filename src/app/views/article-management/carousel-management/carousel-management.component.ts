import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigatorService } from 'src/app/layouts/base/base-navigator/services/navigator.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carousel-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carousel-management.component.html',
  styleUrls: ['./carousel-management.component.scss']
})
export class CarouselManagementComponent implements OnInit {

  constructor(private navigatorService: NavigatorService) {}

  ngOnInit(): void {
    this.navigatorService.setBreadcrumbs(["後台首頁", "輪播管理"]);
  }
}
