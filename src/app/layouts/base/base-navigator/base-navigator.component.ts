import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { Breadcrumb } from 'src/app/commons/abstracts/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-base-navigator',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './base-navigator.component.html',
  styleUrls: ['./base-navigator.component.scss']
})
export class BaseNavigatorComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd) {
        this.getBreadcrumb();
      }
    });
  }

  /**
   * 確認是否為最後一筆麵包屑
   * @param index 索引
   * @returns 是否為最後一筆麵包屑
   */
  public isLastBreadcrumb(index: number): boolean {
    return index == this.breadcrumbs.length - 1;
  }

  /**
   * 取得目前麵包屑
   */
  public getBreadcrumb(): void {
    setTimeout(() => {
      this.breadcrumbs = this.breadcrumbService.getBreadcrumb();
    }, 50);
  }
}
