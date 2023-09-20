import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage/secure-local-storage.service';
import { BaseNavigatorComponent } from '../base-navigator/base-navigator.component';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
    selector: 'app-base-header',
    templateUrl: './base-header.component.html',
    styleUrls: ['./base-header.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, BaseNavigatorComponent]
})
export class BaseHeaderComponent {
  constructor(
    private secureLocalStorageService: SecureLocalStorageService,
    private commonService: CommonService,
    private router: Router
  ) {}

  /**
   * 檢查是否已經登入
   * @returns 是否已經登入
   */
  public isLogin(): boolean {
    return this.commonService.checkAuthenticateStateOffline();
  }

  /**
   * 從後台登出
   */
  public logoutFromBackstage(): void {
    this.commonService.clearAuthenticateData();

    this.router.navigate(['/']);
  }
}
