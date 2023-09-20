import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/commons/abstracts/single-sign-on';
import { NavigatorService } from 'src/app/layouts/base/base-navigator/services/navigator.service';
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
    private navigatorService: NavigatorService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('');
    this.navigatorService.setBreadcrumbs(["後台首頁"]);
    this.getUserInfo();
  }

  private getUserInfo(): void {
    this.userInfo = this.commonService.getUserData();
  }
}
