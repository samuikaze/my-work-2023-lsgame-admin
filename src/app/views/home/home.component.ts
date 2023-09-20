import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/commons/abstracts/single-sign-on';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true
})
export class HomeComponent implements OnInit {

  public userInfo: User = {};
  constructor(
    private breadcrumbService: BreadcrumbService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('');
    this.breadcrumbService.setBreadcrumb();
    this.getUserInfo();
  }

  /**
   * 取得使用者帳號資料
   */
  private getUserInfo(): void {
    this.userInfo = this.commonService.getUserData();
  }
}
