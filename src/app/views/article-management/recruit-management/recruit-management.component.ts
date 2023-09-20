import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorService } from 'src/app/layouts/base/base-navigator/services/navigator.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recruit-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recruit-management.component.html',
  styleUrls: ['./recruit-management.component.scss']
})
export class RecruitManagementComponent implements OnInit {
  constructor(private navigatorService: NavigatorService) {}

  ngOnInit(): void {
    this.navigatorService.setBreadcrumbs(["後台首頁", "招募新血"])
  }
}
