import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonService } from 'src/app/services/common-service/common.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('關於我們管理');
    this.breadcrumbService.setBreadcrumb({
      title: '關於我們管理',
      uri: '/article/aboutus',
    });
  }
}
