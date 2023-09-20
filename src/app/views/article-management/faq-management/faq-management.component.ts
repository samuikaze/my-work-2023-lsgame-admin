import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-faq-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq-management.component.html',
  styleUrls: ['./faq-management.component.scss']
})
export class FaqManagementComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('常見問題管理');
    this.breadcrumbService.setBreadcrumb({
      title: '常見問題管理',
      uri: '/article/faq',
    });
  }
}
