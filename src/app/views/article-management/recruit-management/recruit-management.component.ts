import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-recruit-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recruit-management.component.html',
  styleUrls: ['./recruit-management.component.scss']
})
export class RecruitManagementComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('招募新血管理');
    this.breadcrumbService.setBreadcrumb({
      title: '招募新血管理',
      uri: '/article/recruit',
    });
  }
}
