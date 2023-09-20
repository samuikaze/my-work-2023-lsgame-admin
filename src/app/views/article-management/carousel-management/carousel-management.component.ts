import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/services/common-service/common.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';

@Component({
  selector: 'app-carousel-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carousel-management.component.html',
  styleUrls: ['./carousel-management.component.scss']
})
export class CarouselManagementComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('輪播管理');
    this.breadcrumbService.setBreadcrumb({
      title: '輪播管理',
      uri: '/article/carousel',
    });
  }
}
