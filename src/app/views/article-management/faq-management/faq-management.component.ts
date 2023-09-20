import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorService } from 'src/app/layouts/base/base-navigator/services/navigator.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faq-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq-management.component.html',
  styleUrls: ['./faq-management.component.scss']
})
export class FaqManagementComponent implements OnInit {

  constructor(private navigatorService: NavigatorService) {}

  ngOnInit(): void {
    this.navigatorService.setBreadcrumbs(["後台首頁", "常見問題"]);
  }
}
