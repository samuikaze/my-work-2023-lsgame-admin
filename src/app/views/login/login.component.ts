import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginInformation, LoginStatuses } from './login';
import { ActivatedRoute, Router } from '@angular/router';
import { SecureLocalStorageService } from 'src/app/services/secure-local-storage/secure-local-storage.service';
import { RequestService } from 'src/app/services/request-service/request.service';
import { AppEnvironmentService } from 'src/app/services/app-environment-service/app-environment.service';
import { checkNullAndEmpty } from 'src/app/commons/functions/common-functions';
import { ApiServiceTypes } from 'src/app/enums/api-service-types';
import { BaseResponse } from 'src/app/commons/abstracts/http-client';
import { Account, SignInResponse, TokenUser, User } from 'src/app/commons/abstracts/single-sign-on';
import { HttpErrorResponse } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Abilities } from 'src/app/enums/abilities';
import { CommonService } from 'src/app/services/common-service/common.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb-service/breadcrumb.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() public loginInformation: LoginInformation = {
    account: '',
    password: '',
  };
  public statuses: LoginStatuses = {
    signing: false,
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    private secureLocalStorageService: SecureLocalStorageService,
    private requestService: RequestService,
    private appEnvironmentService: AppEnvironmentService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.commonService.setTitle('登入驗證');
    this.breadcrumbService.setBreadcrumb({ title: '登入驗證', uri: '/' });
    this.loginFromToken()
      .then(result => {
        this.statuses.signing = false;

        if (result) {
          this.router.navigate(['/home']);
        }
      });
  }

  /**
   * 使用網址的權杖登入
   */
  public async loginFromToken(): Promise<boolean> {
    this.statuses.signing = true;

    return new Promise<boolean>(async (resolve) => {
      if (!this.secureLocalStorageService.has('accessToken')) {
        this.route.queryParams.subscribe(async (params) => {
          if (!checkNullAndEmpty(params['token'])) {
            const serviceAccessToken = params['token']
              .replace(/-/g, '+')
              .replace(/_/g, '/');
            const baseUri = await this.appEnvironmentService.getConfig(ApiServiceTypes.SingleSignOn);
            const uri = `${baseUri}/api/v1/system/token`;
            const header = {
              Authorization: `Bearer ${serviceAccessToken}`
            };
            this.requestService.get<BaseResponse<SignInResponse>>(uri, undefined, header)
              .subscribe({
                next: async response => {
                  this.secureLocalStorageService.set(
                    'accessToken',
                    response.data.accessToken.token
                  );
                  this.secureLocalStorageService.set(
                    'refreshToken',
                    response.data.refreshToken.token
                  );
                  const base64UriUser = Buffer.from(
                    response.data.accessToken.token,
                    'base64'
                  )
                    .toString('ascii')
                    .split('.')[1]
                    .replace(/-/g, '+')
                    .replace(/_/g, '/');
                  const user = JSON.parse(
                    Buffer.from(base64UriUser, 'base64').toString('ascii')
                  );
                  await this.getUserData(user);

                  resolve(true);
                },
                error: (errors: HttpErrorResponse) => {
                  this.requestService.requestFailedHandler(errors);
                  alert('權杖驗證失敗，請重新登入');

                  resolve(false);
                }
              });
          } else {
            resolve(false);
          }
        });
      } else {
        resolve(true);
      }
    });
  }

  /**
   * 取得使用者帳號資料
   * @param userInToken 權杖中的使用者帳號資料
   */
  private async getUserData(userInToken: TokenUser): Promise<void> {
    const baseUri = await this.appEnvironmentService.getConfig(ApiServiceTypes.SingleSignOn);
    const uri = `${baseUri}/api/v1/user`;
    return new Promise<void>((resolve, reject) => {
      this.requestService.get<BaseResponse<Account>>(uri).subscribe({
        next: (response) => {
          const user = Object.assign(userInToken, response.data) as User;
          if (user.abilities?.filter(ability => ability.name.includes(Abilities.Backstage)).length === 0) {
            this.commonService.clearAuthenticateData();
            alert('您沒有權限存取後臺，請向管理員確認後再次登入');
            resolve();
            return;
          }
          this.secureLocalStorageService.set('user', JSON.stringify(user));
          resolve();
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);
          resolve();
        },
      });
    });
  }

  /**
   * 檢查是否可以執行登入
   * @returns 是否可以執行登入
   */
  public canFireSignIn(): boolean {
    return (
      !checkNullAndEmpty(this.loginInformation.account) &&
      !checkNullAndEmpty(this.loginInformation.password)
    );
  }

  public async fireSignIn(): Promise<void> {
    this.statuses.signing = true;
    let signInError = "";

    if (
      checkNullAndEmpty(this.loginInformation.account) ||
      checkNullAndEmpty(this.loginInformation.password)
    ) {
      signInError = "請確認所有欄位是否皆已填妥";
      this.statuses.signing = false;
      return;
    }

    const baseUri = await this.appEnvironmentService.getConfig(ApiServiceTypes.SingleSignOn);
    const url = `${baseUri}/api/v1/user/signin`;
    new Promise<boolean>((resolve, reject) => {
      this.requestService.post<BaseResponse<SignInResponse>>(url, this.loginInformation).subscribe({
        next: response => {
          this.secureLocalStorageService.set(
            'accessToken',
            response.data.accessToken.token
          );
          this.secureLocalStorageService.set(
            'refreshToken',
            response.data.refreshToken.token
          );
          const base64UriUser = Buffer.from(
            response.data.accessToken.token,
            'base64'
          )
            .toString('ascii')
            .split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');
          const user = JSON.parse(
            Buffer.from(base64UriUser, 'base64').toString('ascii')
          );
          this.getUserData(user)
            .then(() => resolve(true));
        },
        error: (errors: HttpErrorResponse) => {
          this.requestService.requestFailedHandler(errors);

          resolve(false);
        },
      });
    })
      .then((result) => {
        this.statuses.signing = false;

        if (result) {
          this.router.navigate(['/home'])
        }
      });
  }

  /**
   * 導向到前台
   */
  public navigateToFrontStage(): void {
    this.appEnvironmentService.getConfig<string>(ApiServiceTypes.FrontStage)
      .then(uri => {
        if (uri != null) {
          location.href = uri;
        }

        alert('取得前台網址失敗，請再試一次');
      });
  }
}
